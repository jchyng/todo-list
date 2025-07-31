import { NextResponse } from 'next/server';

/**
 * 표준화된 에러 응답 생성
 * 클라이언트에게 최소한의 정보만 노출
 */

// 표준 에러 메시지 (내부 구조 노출 방지)
export const ERROR_MESSAGES = {
  // 인증 관련
  UNAUTHORIZED: '인증이 필요합니다',
  FORBIDDEN: '권한이 없습니다',
  
  // 요청 관련
  INVALID_REQUEST: '잘못된 요청입니다',
  INVALID_ID: '유효하지 않은 ID입니다',
  MISSING_REQUIRED_FIELDS: '필수 필드가 누락되었습니다',
  
  // 리소스 관련
  RESOURCE_NOT_FOUND: '요청한 데이터를 찾을 수 없습니다',
  RESOURCE_ALREADY_EXISTS: '이미 존재하는 데이터입니다',
  
  // 서버 관련
  INTERNAL_SERVER_ERROR: '서버 내부 오류가 발생했습니다',
  DATABASE_ERROR: '데이터베이스 처리 중 오류가 발생했습니다',
  SERVICE_UNAVAILABLE: '서비스를 일시적으로 사용할 수 없습니다',
  
  // 할 일 관련 특화 메시지
  TODO_CREATE_FAILED: '할 일을 생성하는데 실패했습니다',
  TODO_UPDATE_FAILED: '할 일을 수정하는데 실패했습니다',
  TODO_DELETE_FAILED: '할 일을 삭제하는데 실패했습니다',
  TODO_FETCH_FAILED: '할 일을 불러오는데 실패했습니다',
};

/**
 * 표준화된 에러 응답 생성
 * @param {string} message - 에러 메시지
 * @param {number} status - HTTP 상태 코드
 * @param {Object} additionalData - 추가 데이터 (선택사항)
 */
export function createErrorResponse(message, status = 500, additionalData = {}) {
  const errorResponse = {
    success: false,
    error: message,
    timestamp: new Date().toISOString(),
    ...additionalData
  };

  return NextResponse.json(errorResponse, { status });
}

/**
 * Mongoose 검증 에러를 안전한 메시지로 변환
 * @param {Error} error - Mongoose 검증 에러
 */
export function handleValidationError(error) {
  if (error.name === 'ValidationError') {
    // 구체적인 스키마 정보 노출 방지
    return createErrorResponse(ERROR_MESSAGES.INVALID_REQUEST, 400);
  }
  
  if (error.name === 'CastError') {
    return createErrorResponse(ERROR_MESSAGES.INVALID_ID, 400);
  }
  
  // 기타 에러는 일반적인 메시지로 처리
  return createErrorResponse(ERROR_MESSAGES.INTERNAL_SERVER_ERROR, 500);
}

/**
 * 보안 로깅 - 민감한 정보 제거
 * @param {string} operation - 작업 유형
 * @param {Error} error - 에러 객체
 * @param {Object} context - 컨텍스트 정보
 */
export function secureLog(operation, error, context = {}) {
  // 프로덕션 환경에서는 상세 로그 제한
  if (process.env.NODE_ENV === 'production') {
    console.error(`[${operation}] 오류 발생:`, {
      message: error.message,
      timestamp: new Date().toISOString(),
      // 민감한 정보 제거
      userId: context.userId ? context.userId.substring(0, 8) + '***' : 'unknown'
    });
  } else {
    // 개발 환경에서는 상세 정보 포함
    console.error(`[${operation}] 상세 오류:`, {
      error: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString()
    });
  }
}

/**
 * 성공 응답 생성
 * @param {any} data - 응답 데이터
 * @param {number} status - HTTP 상태 코드
 * @param {string} message - 성공 메시지 (선택사항)
 */
export function createSuccessResponse(data, status = 200, message = null) {
  const response = {
    success: true,
    data,
    timestamp: new Date().toISOString()
  };

  if (message) {
    response.message = message;
  }

  return NextResponse.json(response, { status });
}