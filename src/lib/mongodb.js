import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('MongoDB URI가 .env.local에 정의되지 않았습니다.');
}

/**
 * MongoDB 연결 캐시
 * Next.js에서 hot reload 시 여러 연결이 생성되는 것을 방지
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * MongoDB 연결 함수
 * @returns {Promise<mongoose.Connection>}
 */
async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      // 프로덕션에서는 상세 연결 정보 로깅 제한
      if (process.env.NODE_ENV !== 'production') {
        console.log('MongoDB 연결 성공');
      }
      return mongoose;
    }).catch((error) => {
      // 민감한 연결 정보 노출 방지
      console.error('MongoDB 연결 실패:', {
        message: error.message,
        timestamp: new Date().toISOString()
      });
      throw error;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;