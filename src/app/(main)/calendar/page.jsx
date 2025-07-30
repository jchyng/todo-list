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
  Calendar as CalendarIcon,
  CheckCircle,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  Clock,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";

import {
  getCalendarDays,
  getNextMonthDate,
  getPrevMonthDate,
} from "@/lib/dateUtils";
import todos from "./data.json";
import NumberTicker from "@/components/magicui/number-ticker";

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());

  // 달력에 표시할 날짜 배열 생성
  const calendarDays = useMemo(() => {
    return getCalendarDays(currentDate);
  }, [currentDate]);

  // JSON 데이터를 날짜별로 그룹화
  const todosByDate = useMemo(() => {
    const grouped = {};
    todos.forEach((todo) => {
      const dateKey = todo.date;
      if (!grouped[dateKey]) grouped[dateKey] = [];
      grouped[dateKey].push(todo);
    });
    return grouped;
  }, []);

  const handlePrevMonth = () => {
    setCurrentDate(getPrevMonthDate(currentDate));
  };

  const handleNextMonth = () => {
    setCurrentDate(getNextMonthDate(currentDate));
  };

  const isOverdue = (todo) => {
    if (!todo.dueDate) return false;
    const due = new Date(todo.dueDate);
    return due < new Date();
  };

  return (
    <div className="space-y-6">
      <CalendarHeader
        currentDate={currentDate}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
      />
      <CalendarStats
        todos={todos}
        currentDate={currentDate}
        isOverdue={isOverdue}
      />
      <CalendarGrid
        days={calendarDays}
        currentDate={currentDate}
        todosByDate={todosByDate}
        isOverdue={isOverdue}
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

function CalendarStats({ todos, currentDate, isOverdue }) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthlyTodos = todos.filter((todo) => {
    if (!todo.date) return false;
    const todoDate = new Date(todo.date);
    return todoDate.getFullYear() === year && todoDate.getMonth() === month;
  });

  const statsData = [
    {
      label: "전체",
      value: monthlyTodos.length,
      icon: CheckSquare,
      bg: "bg-blue-100",
      color: "text-blue-600",
    },
    {
      label: "완료",
      value: monthlyTodos.filter((t) => t.completed).length,
      icon: CheckCircle,
      bg: "bg-emerald-100",
      color: "text-emerald-600",
    },
    {
      label: "진행중",
      value: monthlyTodos.filter((t) => !t.completed && !isOverdue(t)).length,
      icon: Clock,
      bg: "bg-amber-100",
      color: "text-amber-600",
    },
    {
      label: "마감",
      value: monthlyTodos.filter((t) => !t.completed && isOverdue(t)).length,
      icon: Clock, // 필요하면 XCircle로 교체 가능
      bg: "bg-red-100",
      color: "text-red-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
      {statsData.map(({ label, value, icon: Icon, bg, color }) => (
        <Card
          key={label}
          className="py-0 border border-slate-200 shadow-sm bg-white hover:shadow-md transition-all duration-200"
        >
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              {/* 아이콘 크기 확대 */}
              <div
                className={`w-10 h-10 ${bg} rounded-lg flex items-center justify-center`}
              >
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div>
                {/* 숫자 폰트 크기 확대 */}
                <p className="text-2xl font-bold text-slate-900">
                  <NumberTicker value={value} />
                </p>
                <p className="text-sm text-slate-600">{label}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function CalendarGrid({ days, currentDate, todosByDate, isOverdue }) {
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
                  {dayTodos.slice(0, 2).map((todo) => (
                    <Badge
                      key={todo.id}
                      variant={todo.completed ? "outline" : "default"}
                      className={cn(
                        "w-full truncate block", // block을 추가해 주로 문제 예방
                        todo.completed &&
                          "bg-green-100/80 text-green-800 border-green-200",
                        !todo.completed &&
                          isOverdue(todo) &&
                          "bg-red-100/80 text-red-800 border-red-200",
                        !todo.completed &&
                          !isOverdue(todo) &&
                          "bg-amber-100/80 text-amber-800 border-amber-200"
                      )}
                    >
                      {todo.title}
                    </Badge>
                  ))}
                  {dayTodos.length > 2 && (
                    <Badge variant="secondary" className="w-full truncate">
                      +{dayTodos.length - 2}개 더 보기
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
    const isOverdue = !todo.completed && new Date(todo.date) < new Date();
    if (todo.completed)
      return {
        label: "완료",
        className: "bg-green-100 text-green-800",
        icon: <CheckCircle className="h-3 w-3" />,
      };
    if (isOverdue)
      return {
        label: "마감",
        className: "bg-red-100 text-red-800",
        icon: <XCircle className="h-3 w-3" />,
      };
    return {
      label: "진행중",
      className: "bg-amber-100 text-amber-800",
      icon: <Clock className="h-3 w-3" />,
    };
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{formattedDate}</DialogTitle>
          <DialogDescription>
            총 {todos.length}개의 할 일이 있습니다.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4 -mr-4">
          <div className="space-y-3 py-2">
            {todos && todos.length > 0 ? (
              todos.map((todo) => {
                const status = getStatusInfo(todo);
                return (
                  <Card key={todo.id} className="overflow-hidden">
                    <CardContent className="p-4 flex items-start space-x-4">
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
                        variant="outline"
                        className={cn(
                          "flex items-center space-x-1.5",
                          status.className
                        )}
                      >
                        {status.icon}
                        <span>{status.label}</span>
                      </Badge>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <div className="text-center py-12">
                <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-medium text-muted-foreground">
                  할 일 없음
                </h3>
                <p className="mt-1 text-sm text-muted-foreground/80">
                  이 날짜에는 등록된 할 일이 없습니다.
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
