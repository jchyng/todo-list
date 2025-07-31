import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Todo from '@/models/Todo';
import { createClient } from '@/lib/supabase/server';
import { ERROR_MESSAGES, createErrorResponse, createSuccessResponse, secureLog } from '@/lib/errors';

/**
 * 달력용 할 일 목록 조회 - 날짜별로 그룹화된 데이터 반환
 * GET /api/todos/calendar?startDate=2024-06-30&endDate=2024-08-03
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

    // 쿼리 파라미터 파싱
    const { searchParams } = new URL(request.url);
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');
    const yearParam = searchParams.get('year');
    const monthParam = searchParams.get('month');

    if (!startDateParam || !endDateParam) {
      return createErrorResponse('시작일(startDate)과 종료일(endDate) 파라미터가 필요합니다.', 400);
    }

    // 날짜 유효성 검사 및 파싱
    const startDate = new Date(startDateParam);
    const endDate = new Date(endDateParam);
    
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return createErrorResponse('잘못된 날짜 형식입니다. YYYY-MM-DD 형식을 사용하세요.', 400);
    }

    // 시간 설정 (하루 전체 범위)
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    // 해당 월의 모든 할 일 조회 (삭제되지 않은 것만: 완료된 작업 + 마감일이 있는 미완료 작업)
    const todos = await Todo.find({
      userId: user.id,
      isDeleted: false,
      $or: [
        // 완료된 작업 (완료일 기준)
        {
          completed: true,
          updatedAt: {
            $gte: startDate,
            $lte: endDate
          }
        },
        // 미완료 작업 (마감일 기준)
        {
          completed: false,
          dueDate: {
            $gte: startDate,
            $lte: endDate
          }
        }
      ]
    }).sort({ createdAt: -1 });

    // 날짜별로 그룹화
    const todosByDate = {};
    
    todos.forEach(todo => {
      let dateKey;
      
      if (todo.completed && todo.updatedAt) {
        // 완료된 작업은 완료일 기준
        const date = new Date(todo.updatedAt);
        dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      } else if (!todo.completed && todo.dueDate) {
        // 미완료 작업은 마감일 기준
        const date = new Date(todo.dueDate);
        dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      }
      
      if (dateKey) {
        if (!todosByDate[dateKey]) {
          todosByDate[dateKey] = [];
        }
        todosByDate[dateKey].push(todo);
      }
    });

    // 통계 계산 (해당 월의 작업만 포함)
    let monthTodos = todos;
    
    // year, month 파라미터가 있으면 해당 월 작업만 필터링
    if (yearParam && monthParam) {
      const year = parseInt(yearParam);
      const month = parseInt(monthParam); // 0-11
      
      const monthStart = new Date(year, month, 1);
      monthStart.setHours(0, 0, 0, 0);
      const monthEnd = new Date(year, month + 1, 0);
      monthEnd.setHours(23, 59, 59, 999);
      
      monthTodos = todos.filter(todo => {
        let relevantDate = null;
        
        if (todo.completed && todo.updatedAt) {
          relevantDate = new Date(todo.updatedAt);
        } else if (!todo.completed && todo.dueDate) {
          relevantDate = new Date(todo.dueDate);
        }
        
        if (!relevantDate) return false;
        
        return relevantDate >= monthStart && relevantDate <= monthEnd;
      });
    }
    
    const totalTodos = monthTodos.length;
    const completedTodos = monthTodos.filter(t => t.completed).length;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const incompleteTodos = monthTodos.filter(t => !t.completed);
    const overdueTodos = incompleteTodos.filter(t => {
      if (!t.dueDate) return false;
      const dueDate = new Date(t.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate < today;
    }).length;
    
    const upcomingTodos = incompleteTodos.filter(t => {
      if (!t.dueDate) return false;
      const dueDate = new Date(t.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate >= today;
    }).length;

    const stats = {
      completed: completedTodos,
      upcoming: upcomingTodos, // 예정된 작업 (오늘 이후 마감)
      overdue: overdueTodos,   // 지연된 작업 (오늘 이전 마감)
      total: totalTodos,
      completionRate: totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0
    };

    return createSuccessResponse({
      todosByDate,
      stats,
      startDate: startDateParam,
      endDate: endDateParam
    });

  } catch (error) {
    secureLog('CALENDAR_TODOS_FETCH', error, { userId: user?.id, operation: 'GET /api/todos/calendar' });
    return createErrorResponse(ERROR_MESSAGES.TODO_FETCH_FAILED, 500);
  }
}