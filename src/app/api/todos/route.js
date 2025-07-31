import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Todo from '@/models/Todo';
import { createClient } from '@/lib/supabase/server';
import { ERROR_MESSAGES, createErrorResponse, createSuccessResponse, handleValidationError, secureLog } from '@/lib/errors';
import { validateAndSanitizeQuery, validateAndSanitizeTodo } from '@/lib/validation';

/**
 * 할 일 목록 조회 (GET /api/todos)
 */
export async function GET(request) {
  try {
    // Supabase 인증 확인
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return createErrorResponse(ERROR_MESSAGES.UNAUTHORIZED, 401);
    }

    // MongoDB 연결
    await connectDB();

    // 쿼리 파라미터 검증 및 파싱
    const { searchParams } = new URL(request.url);
    const queryValidation = validateAndSanitizeQuery(searchParams);
    
    if (!queryValidation.isValid) {
      return createErrorResponse(`잘못된 쿼리 파라미터: ${queryValidation.errors.join(', ')}`, 400);
    }
    
    const { 
      completed, 
      sortBy = 'createdAt', 
      sortOrder = -1,
      startDate, 
      endDate 
    } = queryValidation.options;

    let todos;

    // 날짜 범위 조회
    if (startDate && endDate) {
      todos = await Todo.findByDateRange(
        user.id,
        new Date(startDate),
        new Date(endDate)
      );
    } else {
      // 일반 조회
      const options = { sortBy, sortOrder };
      if (completed !== null) {
        options.completed = completed === 'true';
      }
      todos = await Todo.findByUserId(user.id, options);
    }

    return createSuccessResponse({ todos, count: todos.length });

  } catch (error) {
    secureLog('TODO_FETCH', error, { operation: 'GET /api/todos' });
    return createErrorResponse(ERROR_MESSAGES.TODO_FETCH_FAILED, 500);
  }
}

/**
 * 새 할 일 생성 (POST /api/todos)
 */
export async function POST(request) {
  try {
    // Supabase 인증 확인
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return createErrorResponse(ERROR_MESSAGES.UNAUTHORIZED, 401);
    }

    // 요청 본문 파싱 및 검증
    const body = await request.json();
    const validation = validateAndSanitizeTodo(body);
    
    if (!validation.isValid) {
      return createErrorResponse(`검증 실패: ${validation.errors.join(', ')}`, 400);
    }
    
    const { title, description, dueDate } = validation.data;

    // MongoDB 연결
    await connectDB();

    // 새 할 일 생성 (이미 검증되고 정제된 데이터 사용)
    const newTodo = new Todo({
      userId: user.id,
      title,
      description: description || '',
      dueDate: dueDate ? new Date(dueDate) : null
    });

    const savedTodo = await newTodo.save();

    return createSuccessResponse(savedTodo, 201);

  } catch (error) {
    secureLog('TODO_CREATE', error, { userId: user?.id, operation: 'POST /api/todos' });
    
    // Mongoose 검증 오류 처리
    if (error.name === 'ValidationError' || error.name === 'CastError') {
      return handleValidationError(error);
    }

    return createErrorResponse(ERROR_MESSAGES.TODO_CREATE_FAILED, 500);
  }
}