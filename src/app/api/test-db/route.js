import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Todo from '@/models/Todo';

/**
 * MongoDB 연결 테스트 API (GET /api/test-db)
 */
export async function GET() {
  try {
    // MongoDB 연결 테스트
    await connectDB();
    
    // 테스트 할 일 생성
    const testTodo = new Todo({
      userId: 'test-user-' + Date.now(),
      title: 'MongoDB 연결 테스트',
      description: '이것은 MongoDB 연결을 테스트하는 할 일입니다.',
      completed: false
    });
    
    const savedTodo = await testTodo.save();
    
    // 생성된 할 일 조회
    const foundTodo = await Todo.findById(savedTodo._id);
    
    // 테스트 데이터 삭제
    await Todo.findByIdAndDelete(savedTodo._id);
    
    return NextResponse.json({
      success: true,
      message: 'MongoDB 연결 및 CRUD 테스트 성공',
      data: {
        created: savedTodo,
        found: foundTodo,
        deleted: true
      }
    });
    
  } catch (error) {
    console.error('MongoDB 테스트 실패:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error.message,
        details: '환경 변수 설정을 확인하세요. MONGODB_URI가 올바르게 설정되어 있는지 확인하세요.'
      },
      { status: 500 }
    );
  }
}