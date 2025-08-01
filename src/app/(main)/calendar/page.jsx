"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock,
  AlertTriangle,
  BarChart3,
  TrendingUp,
} from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { TodoItem } from "@/components/TodoItem";

import {
  getCalendarDays,
  getNextMonthDate,
  getPrevMonthDate,
} from "@/lib/dateUtils";
import NumberTicker from "@/components/magicui/number-ticker";
import { fetchCalendarTodos, updateTodo, deleteTodo, toggleTodoComplete } from "@/lib/api";

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [todosByDate, setTodosByDate] = useState({});
  const [monthlyStats, setMonthlyStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [operationLoading, setOperationLoading] = useState(false);

  // 달력에 표시할 날짜 배열 생성
  const calendarDays = useMemo(() => {
    return getCalendarDays(currentDate);
  }, [currentDate]);

  // 월별 할 일 데이터 로드
  const loadMonthlyData = async () => {
    try {
      setLoading(true);
      
      // 달력의 실제 시작일과 종료일 계산 (달력에 표시되는 모든 날짜)
      const calendarDays = getCalendarDays(currentDate);
      const startDate = calendarDays[0]; // 첫 번째 날짜
      const endDate = calendarDays[calendarDays.length - 1]; // 마지막 날짜
      
      // YYYY-MM-DD 형식으로 변환
      const startDateStr = startDate.toISOString().split('T')[0];
      const endDateStr = endDate.toISOString().split('T')[0];
      
      // 현재 월 정보 (통계 계산용)
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth(); // 0-11
      
      // 새로운 달력 API 사용 (통계는 현재 월만 계산)
      const { todosByDate: calendarData, stats } = await fetchCalendarTodos(startDateStr, endDateStr, year, month);
      
      setTodosByDate(calendarData);
      setMonthlyStats(stats);
      setError(null);
    } catch (err) {
      console.error('월별 데이터 로드 실패:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  // 할 일 수정
  const handleUpdateTodo = async (id, updateData) => {
    try {
      setOperationLoading(true);
      const updatedTodo = await updateTodo(id, updateData);
      // 데이터 다시 로드 (날짜가 변경될 수 있으므로)
      await loadMonthlyData();
    } catch (err) {
      console.error('할 일 수정 실패:', err);
      throw err;
    } finally {
      setOperationLoading(false);
    }
  };

  // 할 일 삭제
  const handleDeleteTodo = async (id) => {
    try {
      setOperationLoading(true);
      await deleteTodo(id);
      // 해당 할 일을 todosByDate에서 제거
      setTodosByDate(prev => {
        const newTodosByDate = { ...prev };
        Object.keys(newTodosByDate).forEach(dateKey => {
          newTodosByDate[dateKey] = newTodosByDate[dateKey].filter(todo => todo._id !== id);
          if (newTodosByDate[dateKey].length === 0) {
            delete newTodosByDate[dateKey];
          }
        });
        return newTodosByDate;
      });
    } catch (err) {
      console.error('할 일 삭제 실패:', err);
      throw err;
    } finally {
      setOperationLoading(false);
    }
  };

  // 완료 상태 토글
  const handleToggleComplete = async (id) => {
    try {
      setOperationLoading(true);
      const updatedTodo = await toggleTodoComplete(id);
      // 완료 상태가 변경되면 데이터 다시 로드 (날짜 분류가 변경될 수 있으므로)
      await loadMonthlyData();
    } catch (err) {
      console.error('완료 상태 변경 실패:', err);
      throw err;
    } finally {
      setOperationLoading(false);
    }
  };

  const handlePrevMonth = () => {
    setCurrentDate(getPrevMonthDate(currentDate));
  };

  const handleNextMonth = () => {
    setCurrentDate(getNextMonthDate(currentDate));
  };

  // 월이 변경될 때마다 데이터 로드
  useEffect(() => {
    loadMonthlyData();
  }, [currentDate]);

  if (loading) {
    return (
      <div className="space-y-6">
        <CalendarHeader
          currentDate={currentDate}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
        />
        <div className="text-center py-12">
          <div className="flex items-center justify-center mb-4">
            <LoadingSpinner size="xl" className="text-primary" />
          </div>
          <p className="text-lg font-medium text-foreground">달력 데이터를 불러오는 중...</p>
          <p className="mt-2 text-sm text-muted-foreground">잠시만 기다려주세요</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CalendarHeader
        currentDate={currentDate}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
      />
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">오류: {error}</p>
        </div>
      )}
      <CalendarStats stats={monthlyStats} />
      <CalendarGrid
        days={calendarDays}
        currentDate={currentDate}
        todosByDate={todosByDate}
        onUpdateTodo={handleUpdateTodo}
        onDeleteTodo={handleDeleteTodo}
        onToggleComplete={handleToggleComplete}
      />
    </div>
  );
}

function CalendarHeader({ currentDate, onPrevMonth, onNextMonth }) {
  return (
    <div className="flex items-center justify-center text-center space-x-4">
      <Button variant="ghost" size="icon" onClick={onPrevMonth}>
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <h2 className="text-2xl font-bold tracking-tight">
        {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
      </h2>
      <Button variant="ghost" size="icon" onClick={onNextMonth}>
        <ChevronRight className="h-6 w-6" />
      </Button>
    </div>
  );
}

function StatCard({ icon, label, value, colorClass }) {
  return (
    <Card>
      <CardContent className="px-4">
        <div className="flex items-center space-x-2 mb-1">
          {icon}
          <div className={`text-lg font-medium ${colorClass}`}>{label}</div>
        </div>
        <div>
          <NumberTicker
            value={value}
            className={`text-2xl font-bold ${colorClass}`}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function PercentageCard({ icon, label, value, colorClass }) {
  return (
    <Card>
      <CardContent className="px-4">
        <div className="flex items-center space-x-2 mb-1">
          {icon}
          <div className={`text-lg font-medium ${colorClass}`}>{label}</div>
        </div>
        <div className={`text-2xl font-bold ${colorClass}`}>
          <NumberTicker
            value={value}
            className={`text-2xl font-bold ${colorClass}`}
          />
          %
        </div>
      </CardContent>
    </Card>
  );
}

function CalendarStats({ stats }) {
  if (!stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {[...Array(5)].map((_, i) => (
          <Card key={i}>
            <CardContent className="px-4">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-6 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
      <StatCard
        icon={<CheckCircle2 className="h-5 w-5 text-green-500" />}
        label="완료"
        value={stats.completed}
        colorClass="text-green-600"
      />
      <StatCard
        icon={<Clock className="h-5 w-5 text-amber-500" />}
        label="예정"
        value={stats.upcoming}
        colorClass="text-amber-600"
      />
      <StatCard
        icon={<AlertTriangle className="h-5 w-5 text-red-500" />}
        label="지연"
        value={stats.overdue}
        colorClass="text-red-600"
      />
      <StatCard
        icon={<BarChart3 className="h-5 w-5 text-blue-500" />}
        label="전체"
        value={stats.total}
        colorClass="text-blue-600"
      />
      <PercentageCard
        icon={<TrendingUp className="h-5 w-5 text-purple-500" />}
        label="완료율"
        value={stats.completionRate}
        colorClass="text-purple-600"
      />
    </div>
  );
}

function CalendarGrid({ days, currentDate, todosByDate, onUpdateTodo, onDeleteTodo, onToggleComplete }) {
  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];
  const today = new Date().toDateString();

  const formatDateKey = (date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;

  return (
    <Card className="gap-0 p-0">
      <div className="grid grid-cols-7 border-b">
        {weekDays.map((day, index) => (
          <div
            key={day}
            className={cn(
              "p-3 text-center text-sm font-medium text-muted-foreground",
              index === 0 && "text-red-500",
              index === 6 && "text-blue-500"
            )}
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {days.map((date, index) => {
          const isCurrentMonth = date.getMonth() === currentDate.getMonth();
          const isToday = date.toDateString() === today;
          const dateKey = formatDateKey(date);
          const dayTodos = todosByDate[dateKey] || [];

          return (
            <CalendarDialog 
              key={index} 
              date={date} 
              todos={dayTodos}
              onUpdateTodo={onUpdateTodo}
              onDeleteTodo={onDeleteTodo}
              onToggleComplete={onToggleComplete}
            >
              <div
                className={cn(
                  "h-32 p-2 border-b border-r cursor-pointer transition-colors",
                  !isCurrentMonth && "bg-muted/50 text-muted-foreground",
                  "hover:bg-accent"
                )}
              >
                <div className="flex justify-between items-center mb-1">
                  <time
                    dateTime={date.toISOString()}
                    className={cn(
                      "h-6 w-6 flex items-center justify-center rounded-full text-sm",
                      date.getMonth() !== currentDate.getMonth()
                        ? "text-slate-400"
                        : "",
                      date.getDay() === 0 &&
                        date.getMonth() === currentDate.getMonth()
                        ? "text-red-600"
                        : "",
                      date.getDay() === 6 &&
                        date.getMonth() === currentDate.getMonth()
                        ? "text-blue-600"
                        : "",
                      isToday && "bg-primary text-primary-foreground"
                    )}
                  >
                    {date.getDate()}
                  </time>

                  {dayTodos.length > 0 && (
                    <Badge variant="outline">{dayTodos.length}</Badge>
                  )}
                </div>

                <div className="space-y-1">
                  {dayTodos.slice(0, 3).map((todo) => {
                    // 작업 상태에 따른 스타일 결정
                    let badgeStyle = "";
                    if (todo.completed) {
                      // 완료된 작업 - 녹색
                      badgeStyle =
                        "bg-green-100/80 text-green-800 border-green-200";
                    } else if (todo.dueDate) {
                      const today = new Date().toDateString();
                      const isOverdue =
                        new Date(todo.dueDate) < new Date(today);

                      if (isOverdue) {
                        // 지연된 작업 - 빨간색
                        badgeStyle =
                          "bg-red-100/80 text-red-800 border-red-200";
                      } else {
                        // 미완료 작업 - 주황색
                        badgeStyle =
                          "bg-amber-100/80 text-amber-800 border-amber-200";
                      }
                    }

                    return (
                      <Badge
                        key={todo.id}
                        variant="outline"
                        className={`w-full truncate block ${badgeStyle}`}
                      >
                        {todo.title}
                      </Badge>
                    );
                  })}

                  {dayTodos.length > 3 && (
                    <Badge variant="secondary" className="w-full truncate">
                      +{dayTodos.length - 3}개 더 보기
                    </Badge>
                  )}
                </div>
              </div>
            </CalendarDialog>
          );
        })}
      </div>
    </Card>
  );
}

function CalendarDialog({ date, todos, children, onUpdateTodo, onDeleteTodo, onToggleComplete }) {
  if (!date) return null;

  const formattedDate = `${date.getFullYear()}년 ${
    date.getMonth() + 1
  }월 ${date.getDate()}일 (${
    ["일", "월", "화", "수", "목", "금", "토"][date.getDay()]
  })`;

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent style={{ width: "80vw", maxWidth: "960px" }}>
        <DialogHeader>
          <DialogTitle>{formattedDate}</DialogTitle>
          <DialogDescription>
            {(() => {
              const completedCount = todos.filter(
                (todo) => todo.completed
              ).length;
              const incompleteCount = todos.filter(
                (todo) => !todo.completed
              ).length;

              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const isPast = date < today;
              const incompleteText = isPast ? "마감된 작업" : "예정된 작업";

              if (completedCount > 0 && incompleteCount > 0) {
                return `완료된 작업 ${completedCount}개, ${incompleteText} ${incompleteCount}개가 있습니다.`;
              } else if (completedCount > 0) {
                return `총 ${completedCount}개의 작업을 완료했습니다.`;
              } else if (incompleteCount > 0) {
                return `총 ${incompleteCount}개의 ${incompleteText}이 있습니다.`;
              } else {
                return "작업이 없습니다.";
              }
            })()}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4 -mr-4">
          <div className="divide-y">
            {todos && todos.length > 0 ? (
              todos.map((todo) => (
                <TodoItem
                  key={todo._id}
                  todo={todo}
                  onToggleComplete={onToggleComplete}
                  onDelete={onDeleteTodo}
                  onUpdate={onUpdateTodo}
                />
              ))
            ) : (
              <div className="text-center py-12">
                <CheckCircle className="mx-auto h-12 w-12 text-muted-foreground/80" />
                <h3 className="mt-4 text-lg font-medium text-muted-foreground">
                  작업 없음
                </h3>
                <p className="mt-1 text-sm text-muted-foreground/80">
                  이 날짜에는 작업이 없습니다.
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
