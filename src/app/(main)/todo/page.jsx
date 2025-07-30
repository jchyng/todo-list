"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import {
  ClipboardList,
  Check,
  Edit,
  Trash2,
  BadgeCheck,
  AlarmCheck,
  CalendarIcon,
} from "lucide-react";

import { format } from "date-fns";
import { ko } from "date-fns/locale";

import data from "./data.json";

import { useState } from "react";
import { Separator } from "@/components/ui/separator";

export default function TodoPage() {
  return (
    <div className="flex flex-col gap-6 ">
      <AddTodoCard />
      <TodoListCard todos={data} />
    </div>
  );
}

function AddTodoCard() {
  const [task, setTask] = useState("");

  const handleAdd = () => {
    if (task.trim() === "") return;
    console.log("새 작업 추가:", task);
    setTask(""); // 입력 초기화
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>작업 추가</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <Input
            placeholder="할 일을 입력하세요"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
          <Button onClick={handleAdd}>추가</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function TodoListCard({ todos }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>
          <div className="flex justify-between items-center">
            <span>작업 목록</span>
            <TodoFilters todos={todos} />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 border-t">
        <TodoList todos={todos} />
      </CardContent>
    </Card>
  );
}

function TodoFilters({ todos }) {
  const [activeFilter, setActiveFilter] = useState("all");

  const total = todos.length;
  const pending = todos.filter((t) => !t.completed).length;
  const completed = todos.filter((t) => t.completed).length;

  return (
    <div className="flex items-center gap-2">
      <FilterButton
        active={activeFilter === "all"}
        color="blue"
        label="전체"
        count={total}
        onClick={() => setActiveFilter("all")}
      />
      <FilterButton
        active={activeFilter === "pending"}
        color="amber"
        label="미완료"
        count={pending}
        onClick={() => setActiveFilter("pending")}
      />
      <FilterButton
        active={activeFilter === "completed"}
        color="emerald"
        label="완료"
        count={completed}
        onClick={() => setActiveFilter("completed")}
      />
    </div>
  );
}

function FilterButton({ active, color, label, count, onClick }) {
  const colors = {
    blue: {
      bg: "bg-blue-100",
      text: "text-blue-800",
      border: "border-blue-200",
      dot: "bg-blue-500",
    },
    amber: {
      bg: "bg-amber-100",
      text: "text-amber-800",
      border: "border-amber-200",
      dot: "bg-amber-500",
    },
    emerald: {
      bg: "bg-emerald-100",
      text: "text-emerald-800",
      border: "border-emerald-200",
      dot: "bg-emerald-500",
    },
  };
  const colorStyle = colors[color] || colors.blue;

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      className={`flex items-center gap-2 rounded-lg transition-colors ${
        active
          ? `${colorStyle.bg} ${colorStyle.text} border ${colorStyle.border}`
          : "text-slate-600 hover:text-slate-800 hover:bg-slate-100"
      }`}
    >
      <div className={`w-3 h-3 rounded-full ${colorStyle.dot}`} />
      <span>
        {label} {count}
      </span>
    </Button>
  );
}

function TodoList({ todos }) {
  if (todos.length === 0) return <EmptyState />;

  return (
    <div className="divide-y">
      {todos.map((item) => (
        <TodoItem key={item.id} todo={item} />
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="p-12 text-center">
      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
        <ClipboardList className="w-8 h-8 text-muted-foreground" />
      </div>
      <p className="text-muted-foreground font-medium">할 일이 없습니다</p>
      <p className="text-sm text-muted-foreground mt-1">
        새로운 할 일을 추가해보세요
      </p>
    </div>
  );
}

function TodoItem({ todo }) {
  const { title, description, completed, dueDate, updatedAt } = todo;

  return (
    <div className="p-6 hover:bg-muted/50 transition-colors flex items-start gap-4">
      {/* 체크박스 */}
      <Button
        variant="ghost"
        size="sm"
        className={`w-5 h-5 p-0 rounded flex items-center justify-center ${
          completed ? "bg-emerald-500" : "border-2 border-muted-foreground/30"
        }`}
      >
        {completed && <Check className="w-3 h-3 text-white" />}
      </Button>

      {/* 본문 */}
      <div className="flex-1 min-w-0">
        <p
          className={`font-medium ${
            completed ? "line-through text-muted-foreground" : ""
          }`}
        >
          {title}
        </p>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>

        <div className="flex items-center gap-6 mt-2 text-sm text-muted-foreground">
          {dueDate && (
            <span className="flex items-center gap-1.5 text-red-400 font-medium">
              <AlarmCheck className="w-4 h-4" />
              {new Date(dueDate).toLocaleString("ko-KR", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          )}
          {completed && updatedAt && (
            <span className="flex items-center gap-1.5 text-emerald-600/90 font-medium">
              <BadgeCheck className="w-4 h-4" />
              {new Date(updatedAt).toLocaleString("ko-KR", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          )}
        </div>
      </div>

      {/* 액션 버튼 */}
      <div className="flex items-center gap-2">
        <Badge
          variant={completed ? "default" : "secondary"}
          className={
            completed
              ? "bg-emerald-100 text-emerald-800"
              : "bg-amber-100 text-amber-800"
          }
        >
          {completed ? "완료" : "진행중"}
        </Badge>
        <EditTodoDialog todo={todo}>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
          >
            <Edit className="w-4 h-4" />
          </Button>
        </EditTodoDialog>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-red-500"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

function EditTodoDialog({ todo, children }) {
  const [form, setForm] = useState({
    title: todo.title || "",
    description: todo.description || "",
    completed: todo.completed || false,
    startDate: todo.startDate ? new Date(todo.startDate) : null,
    dueDate: todo.dueDate ? new Date(todo.dueDate) : null,
  });

  const handleSave = () => {
    console.log("저장 데이터:", form);
    // TODO: API 호출
  };

  // 시간 옵션 생성 (00:00 ~ 23:30, 30분 단위)
  const timeOptions = Array.from({ length: 48 }, (_, i) => {
    const h = String(Math.floor(i / 2)).padStart(2, "0");
    const m = i % 2 === 0 ? "00" : "30";
    return `${h}:${m}`;
  });

  const handleTimeChange = (field, time) => {
    if (!form[field]) return;
    const [h, m] = time.split(":");
    const updated = new Date(form[field]);
    updated.setHours(h, m);
    setForm({ ...form, [field]: updated });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>작업 수정</DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* 제목 */}
          <div className="grid gap-2">
            <Label htmlFor="title">제목</Label>
            <Input
              id="title"
              name="title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="할 일 제목을 입력하세요"
            />
          </div>

          {/* 설명 */}
          <div className="grid gap-2">
            <Label htmlFor="description">설명</Label>
            <Textarea
              id="description"
              name="description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="할 일에 대한 설명을 입력하세요"
            />
          </div>

          {/* 시작 날짜 & 시간 */}
          <div className="grid gap-2">
            <Label>시작 날짜</Label>
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-[120px] justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {form.startDate
                      ? format(form.startDate, "M월 d일", { locale: ko })
                      : "날짜 선택"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="py-2 flex justify-center"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={form.startDate}
                    onSelect={(date) => setForm({ ...form, startDate: date })}
                    initialFocus
                    locale={ko}
                  />
                </PopoverContent>
              </Popover>
              <Select
                value={form.startDate ? format(form.startDate, "HH:mm") : ""}
                onValueChange={(val) => handleTimeChange("startDate", val)}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="시간 선택" />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 마감 날짜 & 시간 */}
          <div className="grid gap-2">
            <Label>마감 날짜</Label>
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-[120px] justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {form.dueDate
                      ? format(form.dueDate, "M월 d일", { locale: ko })
                      : "날짜 선택"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="py-2 flex justify-center"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={form.dueDate}
                    onSelect={(date) => setForm({ ...form, dueDate: date })}
                    initialFocus
                    locale={ko}
                  />
                </PopoverContent>
              </Popover>
              <Select
                value={form.dueDate ? format(form.dueDate, "HH:mm") : ""}
                onValueChange={(val) => handleTimeChange("dueDate", val)}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="시간 선택" />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 완료 여부 */}
          <div className="flex items-center space-x-2 mt-6">
            <Checkbox
              id="completed"
              checked={form.completed}
              onCheckedChange={(checked) =>
                setForm({ ...form, completed: checked })
              }
            />
            <Label htmlFor="completed">완료됨</Label>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline">
            취소
          </Button>
          <Button type="button" onClick={handleSave}>
            저장
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
