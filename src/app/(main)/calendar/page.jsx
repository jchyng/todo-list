"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";

import {
  getCalendarDays,
  getNextMonthDate,
  getPrevMonthDate,
} from "@/lib/dateUtils";
import NumberTicker from "@/components/magicui/number-ticker";
import todos from "./data.json";

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());

  // 달력에 표시할 날짜 배열 생성
  const calendarDays = useMemo(() => {
    return getCalendarDays(currentDate);
  }, [currentDate]);

  const monthlyTodos = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    return todos.filter((todo) => {
      const dateString = todo.completed ? todo.completedDate : todo.dueDate;
      if (!dateString) {
        return false;
      }
      const date = new Date(dateString);
      return date.getFullYear() === year && date.getMonth() === month;
    });
  }, [currentDate]);

  // 완료된 작업(완료 날짜별) + 미완료 작업(마감일별) 그룹화
  const todosByDate = useMemo(() => {
    const grouped = {};

    todos.forEach((todo) => {
      let dateKey = null;

      // 완료된 작업이고 완료 날짜가 있는 경우
      if (todo.completed && todo.completedDate) {
        dateKey = todo.completedDate;
      }
      // 미완료 작업이고 마감일이 있는 경우
      else if (!todo.completed && todo.dueDate) {
        dateKey = todo.dueDate;
      }

      if (dateKey) {
        if (!grouped[dateKey]) grouped[dateKey] = [];
        grouped[dateKey].push(todo);
      }
    });

    return grouped;
  }, []);

  const handlePrevMonth = () => {
    setCurrentDate(getPrevMonthDate(currentDate));
  };

  const handleNextMonth = () => {
    setCurrentDate(getNextMonthDate(currentDate));
  };

  return (
    <div className="space-y-6">
      <CalendarHeader
        currentDate={currentDate}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
      />
      <CalendarStats todos={monthlyTodos} />
      <CalendarGrid
        days={calendarDays}
        currentDate={currentDate}
        todosByDate={todosByDate}
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

function CalendarStats({ todos }) {
  const stats = useMemo(() => {
    const completed = todos.filter((todo) => todo.completed).length;
    const incomplete = todos.filter(
      (todo) => !todo.completed && todo.dueDate
    ).length;
    const overdue = todos.filter((todo) => {
      if (!todo.dueDate || todo.completed) return false;
      const today = new Date();
      const dueDate = new Date(todo.dueDate);
      return dueDate < today;
    }).length;
    const total = completed + incomplete;
    const completionRate =
      total > 0 ? Math.round((completed / total) * 100) : 0;

    return { completed, incomplete, overdue, total, completionRate };
  }, [todos]);

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
        value={stats.incomplete - stats.overdue}
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

function CalendarGrid({ days, currentDate, todosByDate }) {
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
            <CalendarDialog key={index} date={date} todos={dayTodos}>
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

function CalendarDialog({ date, todos, children }) {
  if (!date) return null;

  const formattedDate = `${date.getFullYear()}년 ${
    date.getMonth() + 1
  }월 ${date.getDate()}일 (${
    ["일", "월", "화", "수", "목", "금", "토"][date.getDay()]
  })`;

  const getStatusInfo = (todo) => {
    if (todo.completed) {
      return {
        label: "완료",
        className: "bg-green-100 text-green-800",
        icon: <CheckCircle className="h-3 w-3" />,
      };
    } else if (todo.dueDate) {
      const today = new Date();
      const dueDate = new Date(todo.dueDate);
      const isOverdue = dueDate < today;

      if (isOverdue) {
        return {
          label: "지연",
          className: "bg-red-100 text-red-800",
          icon: <CheckCircle className="h-3 w-3" />,
        };
      } else {
        return {
          label: "예정",
          className: "bg-amber-100 text-amber-800",
          icon: <CheckCircle className="h-3 w-3" />,
        };
      }
    }

    return {
      label: "미완료",
      className: "bg-gray-100 text-gray-800",
      icon: <CheckCircle className="h-3 w-3" />,
    };
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-lg">
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
          <div className="space-y-3 py-2">
            {todos && todos.length > 0 ? (
              todos.map((todo) => {
                const status = getStatusInfo(todo);
                return (
                  <Card key={todo.id} className="overflow-hidden">
                    <CardContent className="px-4 flex items-center gap-4">
                      <div className="flex-1">
                        <p
                          className={cn(
                            "font-semibold",
                            todo.completed &&
                              "line-through text-muted-foreground"
                          )}
                        >
                          {todo.title}
                        </p>
                        {todo.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {todo.description}
                          </p>
                        )}
                      </div>
                      <Badge
                        className={cn(
                          "flex items-center gap-2",
                          status.className
                        )}
                      >
                        {status.icon}
                        <span>{status.label}</span>
                      </Badge>
                      {status.label === "지연" && (
                        <Button
                          variant="ghost"
                          onClick={() => alert("지연된 작업을 처리하세요.")}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })
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
