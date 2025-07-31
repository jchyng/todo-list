import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Todo from '@/models/Todo';
import { createClient } from '@/lib/supabase/server';
import { ERROR_MESSAGES, createErrorResponse, createSuccessResponse, secureLog } from '@/lib/errors';

/**
 * 디버깅용 API - 개발 환경에서만 사용 가능
 * 프로덕션에서는 비활성화됨
 */
export async function GET() {
  // 프로덕션 환경에서는 디버그 API 비활성화
  if (process.env.NODE_ENV === 'production') {
    return createErrorResponse(ERROR_MESSAGES.RESOURCE_NOT_FOUND, 404);
  }

  try {
    // Supabase 인증 확인
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return createErrorResponse(ERROR_MESSAGES.UNAUTHORIZED, 401);
    }

    // MongoDB 연결
    await connectDB();

    // 모든 할 일 조회 (raw 데이터)
    const allTodos = await Todo.find({ userId: user.id }).sort({ createdAt: -1 });
    
    // 완료된 작업만 필터링
    const completedTodos = allTodos.filter(todo => todo.completed);
    
    // 현재 월의 시작일과 종료일
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    // 날짜 범위 내 할 일 조회
    const monthlyTodos = await Todo.findByDateRange(user.id, startDate, endDate);
    
    // 통계 계산 테스트
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const completedInMonth = monthlyTodos.filter(todo => todo.completed);
    const incompleteWithDueDate = monthlyTodos.filter(todo => !todo.completed && todo.dueDate);
    const overdueCount = incompleteWithDueDate.filter(todo => {
      const dueDate = new Date(todo.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate < today;
    }).length;
    const upcomingCount = incompleteWithDueDate.filter(todo => {
      const dueDate = new Date(todo.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate >= today;
    }).length;
    
    return createSuccessResponse({
      // 민감한 사용자 ID 대신 마스킹 처리
      currentUser: user.id.substring(0, 8) + '***',
      currentMonth: `${now.getFullYear()}-${now.getMonth() + 1}`,
      counts: {
        total: allTodos.length,
        completed: completedTodos.length,
        monthlyRange: monthlyTodos.length,
        completedInMonth: completedInMonth.length,
        overdue: overdueCount,
        upcoming: upcomingCount
      }
      // samples와 dateRange 제거 - 내부 구조 노출 방지
    });

  } catch (error) {
    secureLog('DEBUG_API', error, { operation: 'GET /api/debug-todos' });
    return createErrorResponse(ERROR_MESSAGES.INTERNAL_SERVER_ERROR, 500);
  }
}