import mongoose from 'mongoose';

// Todo 스키마 정의
const TodoSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, '사용자 ID는 필수입니다'],
    index: true // 사용자별 조회 성능 향상
  },
  title: {
    type: String,
    required: [true, '제목은 필수입니다'],
    trim: true,
    maxlength: [200, '제목은 200자를 초과할 수 없습니다']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, '설명은 1000자를 초과할 수 없습니다'],
    default: ''
  },
  completed: {
    type: Boolean,
    default: false,
    index: true // 완료 상태별 조회 성능 향상
  },
  dueDate: {
    type: Date,
    default: null,
    index: true // 마감일별 조회 성능 향상
  },
  // createdAt과 updatedAt은 timestamps: true 옵션으로 자동 관리됨
}, {
  // 스키마 옵션
  timestamps: true, // createdAt, updatedAt 자동 관리
  collection: 'todos' // 컬렉션 이름 명시적 지정
});

// 인덱스 생성 (복합 인덱스)
TodoSchema.index({ userId: 1, createdAt: -1 }); // 사용자별 최신순 조회
TodoSchema.index({ userId: 1, completed: 1 }); // 사용자별 완료 상태 조회
TodoSchema.index({ userId: 1, dueDate: 1 }); // 사용자별 마감일 조회

// timestamps: true 옵션이 자동으로 updatedAt을 관리하므로 미들웨어 불필요

// 가상 필드: 지연 여부 계산
TodoSchema.virtual('isOverdue').get(function() {
  if (!this.dueDate || this.completed) return false;
  return new Date() > this.dueDate;
});

// JSON 직렬화 시 가상 필드 포함
TodoSchema.set('toJSON', { virtuals: true });
TodoSchema.set('toObject', { virtuals: true });

// 정적 메서드: 사용자별 할 일 조회
TodoSchema.statics.findByUserId = function(userId, options = {}) {
  const { completed, sortBy = 'createdAt', sortOrder = -1 } = options;
  
  const query = { userId };
  if (typeof completed === 'boolean') {
    query.completed = completed;
  }
  
  return this.find(query).sort({ [sortBy]: sortOrder });
};

// 정적 메서드: 날짜 범위별 할 일 조회
TodoSchema.statics.findByDateRange = function(userId, startDate, endDate) {
  // 종료 날짜를 하루 끝 시간으로 설정 (23:59:59.999)
  const endDateTime = new Date(endDate);
  endDateTime.setHours(23, 59, 59, 999);
  
  return this.find({
    userId,
    $or: [
      // 마감일이 해당 범위에 있는 할 일 (완료/미완료 모두)
      {
        dueDate: {
          $gte: startDate,
          $lte: endDateTime
        }
      },
      // 완료된 할 일 중 완료 날짜가 해당 범위에 있는 것
      {
        completed: true,
        updatedAt: {
          $gte: startDate,
          $lte: endDateTime
        }
      }
    ]
  });
};

// 인스턴스 메서드: 완료 상태 토글
TodoSchema.methods.toggleComplete = function() {
  this.completed = !this.completed;
  // timestamps: true가 설정되어 있으므로 updatedAt은 자동으로 업데이트됨
  return this.save();
};

// 모델 생성 (이미 존재하는 경우 기존 모델 사용)
const Todo = mongoose.models.Todo || mongoose.model('Todo', TodoSchema);

export default Todo;