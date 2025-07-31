/**
 * API 유틸리티 함수들
 * 클라이언트에서 MongoDB API를 호출하는 함수들
 */

const API_BASE = '/api/todos';

/**
 * API 응답 에러 처리
 */
async function handleApiResponse(response) {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || '요청 처리 중 오류가 발생했습니다');
  }
  
  return data;
}

/**
 * 할 일 목록 조회 (목록 페이지용 - 스마트 정렬)
 * @returns {Promise<Object>} {todos: Array, count: number, stats: Object}
 */
export async function fetchTodoList() {
  try {
    const response = await fetch('/api/todos/list');
    const result = await handleApiResponse(response);
    
    return result.data;
  } catch (error) {
    console.error('할 일 목록 조회 실패:', error);
    throw error;
  }
}

/**
 * 달력용 할 일 목록 조회 (날짜별 그룹화)
 * @param {string} startDate - 시작일 (YYYY-MM-DD)
 * @param {string} endDate - 종료일 (YYYY-MM-DD)
 * @param {number} year - 통계 계산용 연도
 * @param {number} month - 통계 계산용 월 (0-11)
 * @returns {Promise<Object>} {todosByDate: Object, stats: Object}
 */
export async function fetchCalendarTodos(startDate, endDate, year, month) {
  try {
    const params = new URLSearchParams();
    params.append('startDate', startDate);
    params.append('endDate', endDate);
    if (year !== undefined && month !== undefined) {
      params.append('year', year.toString());
      params.append('month', month.toString());
    }
    
    const response = await fetch(`/api/todos/calendar?${params}`);
    const result = await handleApiResponse(response);
    
    return result.data;
  } catch (error) {
    console.error('달력 데이터 조회 실패:', error);
    throw error;
  }
}

/**
 * 레거시 할 일 목록 조회 (기존 호환성을 위해 유지)
 * @param {Object} options - 조회 옵션
 * @param {boolean} options.completed - 완료 상태 필터
 * @param {string} options.sortBy - 정렬 기준 (createdAt, dueDate, title)
 * @param {string} options.sortOrder - 정렬 순서 (asc, desc)
 * @param {string} options.startDate - 시작 날짜 (YYYY-MM-DD)
 * @param {string} options.endDate - 종료 날짜 (YYYY-MM-DD)
 * @returns {Promise<Array>} 할 일 목록
 */
export async function fetchTodos(options = {}) {
  try {
    const params = new URLSearchParams();
    
    if (options.completed !== undefined) {
      params.append('completed', options.completed.toString());
    }
    if (options.sortBy) {
      params.append('sortBy', options.sortBy);
    }
    if (options.sortOrder) {
      params.append('sortOrder', options.sortOrder);
    }
    if (options.startDate) {
      params.append('startDate', options.startDate);
    }
    if (options.endDate) {
      params.append('endDate', options.endDate);
    }

    const url = params.toString() ? `${API_BASE}?${params}` : API_BASE;
    const response = await fetch(url);
    const result = await handleApiResponse(response);
    
    // API returns {todos, count} structure, extract todos array
    return result.data.todos;
  } catch (error) {
    console.error('할 일 목록 조회 실패:', error);
    throw error;
  }
}

/**
 * 특정 할 일 조회
 * @param {string} id - 할 일 ID
 * @returns {Promise<Object>} 할 일 데이터
 */
export async function fetchTodo(id) {
  try {
    const response = await fetch(`${API_BASE}/${id}`);
    const result = await handleApiResponse(response);
    
    return result.data;
  } catch (error) {
    console.error('할 일 조회 실패:', error);
    throw error;
  }
}

/**
 * 새 할 일 생성
 * @param {Object} todoData - 할 일 데이터
 * @param {string} todoData.title - 제목 (필수)
 * @param {string} todoData.description - 설명
 * @param {string} todoData.dueDate - 마감 날짜 (ISO 형식)
 * @returns {Promise<Object>} 생성된 할 일 데이터
 */
export async function createTodo(todoData) {
  try {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(todoData),
    });
    
    const result = await handleApiResponse(response);
    return result.data;
  } catch (error) {
    console.error('할 일 생성 실패:', error);
    throw error;
  }
}

/**
 * 할 일 수정
 * @param {string} id - 할 일 ID
 * @param {Object} updateData - 수정할 데이터
 * @returns {Promise<Object>} 수정된 할 일 데이터
 */
export async function updateTodo(id, updateData) {
  try {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });
    
    const result = await handleApiResponse(response);
    return result.data;
  } catch (error) {
    console.error('할 일 수정 실패:', error);
    throw error;
  }
}

/**
 * 할 일 삭제
 * @param {string} id - 할 일 ID
 * @returns {Promise<Object>} 삭제된 할 일 데이터
 */
export async function deleteTodo(id) {
  try {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE',
    });
    
    const result = await handleApiResponse(response);
    return result.data;
  } catch (error) {
    console.error('할 일 삭제 실패:', error);
    throw error;
  }
}

/**
 * 할 일 완료 상태 토글
 * @param {string} id - 할 일 ID
 * @returns {Promise<Object>} 업데이트된 할 일 데이터
 */
export async function toggleTodoComplete(id) {
  try {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'PATCH',
    });
    
    const result = await handleApiResponse(response);
    return result.data;
  } catch (error) {
    console.error('할 일 상태 변경 실패:', error);
    throw error;
  }
}

