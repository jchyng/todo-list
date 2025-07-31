import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Todo from '@/models/Todo';
import { createClient } from '@/lib/supabase/server';
import { ERROR_MESSAGES, createErrorResponse, createSuccessResponse, secureLog } from '@/lib/errors';

/**
 * 할 일 목록용 조회 - 스마트 정렬된 할 일 목록 반환
 * - 마감기한이 없거나 마감일이 지나지 않은 데이터만
 * - 정렬: 마감일이 빠른 것 > 마감일이 없는 것 > 완료된 작업
 * GET /api/todos/list
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

    const today = new Date();
    const todayStart = new Date(today);
    todayStart.setHours(0, 0, 0, 0); // 오늘 시작
    const todayEnd = new Date(today);
    todayEnd.setHours(23, 59, 59, 999); // 오늘 끝

    // 조건에 맞는 할 일 조회 (삭제되지 않은 것만)
    const todos = await Todo.find({
      userId: user.id,
      isDeleted: false,
      $or: [
        // 마감일이 없는 모든 작업
        { dueDate: { $exists: false } },
        { dueDate: null },
        // 마감일이 오늘 이후인 작업 (지나지 않은 작업)
        { dueDate: { $gt: todayEnd } },
        // 마감일이 오늘인 작업 (마감되었어도 표시)
        { 
          dueDate: { 
            $gte: todayStart, 
            $lte: todayEnd 
          } 
        },
        // 완료된 작업 (마감일 상관없이)
        { completed: true }
      ]
    });

    // 스마트 정렬 로직
    const sortedTodos = todos.sort((a, b) => {
      // 1. 완료 상태 기준 정렬 (미완료 작업이 먼저)
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }

      // 2. 미완료 작업 내에서의 정렬
      if (!a.completed && !b.completed) {
        const aHasDue = a.dueDate && a.dueDate !== null;
        const bHasDue = b.dueDate && b.dueDate !== null;

        // 둘 다 마감일이 있는 경우: 마감일이 빠른 순
        if (aHasDue && bHasDue) {
          return new Date(a.dueDate) - new Date(b.dueDate);
        }

        // 한쪽만 마감일이 있는 경우: 마감일이 있는 것이 먼저
        if (aHasDue && !bHasDue) return -1;
        if (!aHasDue && bHasDue) return 1;

        // 둘 다 마감일이 없는 경우: 생성일 역순
        return new Date(b.createdAt) - new Date(a.createdAt);
      }

      // 3. 완료된 작업 내에서의 정렬: 완료일 역순
      if (a.completed && b.completed) {
        return new Date(b.updatedAt) - new Date(a.updatedAt);
      }

      return 0;
    });

    // 통계 계산
    const completedCount = sortedTodos.filter(t => t.completed).length;
    const pendingCount = sortedTodos.filter(t => !t.completed).length;

    return createSuccessResponse({
      todos: sortedTodos,
      count: sortedTodos.length,
      stats: {
        total: sortedTodos.length,
        completed: completedCount,
        pending: pendingCount
      }
    });

  } catch (error) {
    secureLog('LIST_TODOS_FETCH', error, { userId: user?.id, operation: 'GET /api/todos/list' });
    return createErrorResponse(ERROR_MESSAGES.TODO_FETCH_FAILED, 500);
  }
}