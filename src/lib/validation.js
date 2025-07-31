/**
 * 입력 데이터 검증 및 sanitization 유틸리티
 */

/**
 * HTML 태그 제거 (기본적인 XSS 방지)
 * @param {string} input - 입력 문자열
 * @returns {string} - 정제된 문자열
 */
export function sanitizeHtml(input) {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // script 태그 제거
    .replace(/<[^>]+>/g, '') // 모든 HTML 태그 제거
    .trim();
}

/**
 * 문자열 길이 검증
 * @param {string} value - 검증할 값
 * @param {number} min - 최소 길이
 * @param {number} max - 최대 길이
 * @returns {boolean} - 유효성 여부
 */
export function validateStringLength(value, min = 0, max = Infinity) {
  if (typeof value !== 'string') return false;
  const length = value.trim().length;
  return length >= min && length <= max;
}

/**
 * 날짜 형식 검증 (ISO 8601)
 * @param {string} dateString - 검증할 날짜 문자열
 * @returns {boolean} - 유효성 여부
 */
export function validateDateFormat(dateString) {
  if (!dateString) return true; // null/undefined는 허용 (선택적 필드)
  
  try {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime()) && date.toISOString() === dateString;
  } catch {
    return false;
  }
}

/**
 * 할 일 데이터 검증 및 정제
 * @param {Object} todoData - 할 일 데이터
 * @returns {Object} - 검증 결과와 정제된 데이터
 */
export function validateAndSanitizeTodo(todoData) {
  const errors = [];
  const sanitized = {};

  // 제목 검증 및 정제
  if (!todoData.title || typeof todoData.title !== 'string') {
    errors.push('제목은 필수입니다');
  } else {
    const title = sanitizeHtml(todoData.title);
    if (!validateStringLength(title, 1, 200)) {
      errors.push('제목은 1자 이상 200자 이하여야 합니다');
    } else {
      sanitized.title = title;
    }
  }

  // 설명 검증 및 정제 (선택적)
  if (todoData.description !== undefined) {
    if (typeof todoData.description === 'string') {
      const description = sanitizeHtml(todoData.description);
      if (!validateStringLength(description, 0, 1000)) {
        errors.push('설명은 1000자 이하여야 합니다');
      } else {
        sanitized.description = description;
      }
    } else {
      errors.push('설명은 문자열이어야 합니다');
    }
  }

  // 완료 상태 검증 (선택적)
  if (todoData.completed !== undefined) {
    if (typeof todoData.completed === 'boolean') {
      sanitized.completed = todoData.completed;
    } else {
      errors.push('완료 상태는 boolean 값이어야 합니다');
    }
  }


  // 마감 날짜 검증 (선택적)
  if (todoData.dueDate !== undefined) {
    if (todoData.dueDate === null || validateDateFormat(todoData.dueDate)) {
      sanitized.dueDate = todoData.dueDate;
    } else {
      errors.push('마감 날짜 형식이 올바르지 않습니다');
    }
  }


  return {
    isValid: errors.length === 0,
    errors,
    data: sanitized
  };
}

/**
 * ObjectId 형식 검증
 * @param {string} id - 검증할 ID
 * @returns {boolean} - 유효성 여부
 */
export function validateObjectId(id) {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

/**
 * 쿼리 파라미터 검증 및 정제
 * @param {URLSearchParams} searchParams - URL 검색 파라미터
 * @returns {Object} - 정제된 쿼리 옵션
 */
export function validateAndSanitizeQuery(searchParams) {
  const options = {};
  const errors = [];

  // completed 파라미터
  const completed = searchParams.get('completed');
  if (completed !== null) {
    if (completed === 'true' || completed === 'false') {
      options.completed = completed === 'true';
    } else {
      errors.push('completed는 true 또는 false여야 합니다');
    }
  }

  // sortBy 파라미터
  const sortBy = searchParams.get('sortBy');
  const allowedSortFields = ['createdAt', 'updatedAt', 'title', 'dueDate'];
  if (sortBy && allowedSortFields.includes(sortBy)) {
    options.sortBy = sortBy;
  } else if (sortBy) {
    errors.push('지원하지 않는 정렬 필드입니다');
  }

  // sortOrder 파라미터
  const sortOrder = searchParams.get('sortOrder');
  if (sortOrder && (sortOrder === 'asc' || sortOrder === 'desc')) {
    options.sortOrder = sortOrder === 'asc' ? 1 : -1;
  } else if (sortOrder) {
    errors.push('정렬 순서는 asc 또는 desc여야 합니다');
  }

  // 날짜 범위 파라미터
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  
  if (startDate && validateDateFormat(startDate + 'T00:00:00.000Z')) {
    options.startDate = startDate;
  } else if (startDate) {
    errors.push('시작 날짜 형식이 올바르지 않습니다');
  }

  if (endDate && validateDateFormat(endDate + 'T23:59:59.999Z')) {
    options.endDate = endDate;
  } else if (endDate) {
    errors.push('종료 날짜 형식이 올바르지 않습니다');
  }

  return {
    isValid: errors.length === 0,
    errors,
    options
  };
}