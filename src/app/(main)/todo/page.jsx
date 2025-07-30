"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  ClipboardList,
  Check,
  Edit,
  Trash2,
  BadgeCheck,
  AlarmCheck,
} from "lucide-react";

import data from "./data.json";

export default function TodoPage() {
  return (
    <div className="flex flex-col gap-6 ">
      <AddTodo />
      <TodoList todos={data} />
    </div>
  );
}

function AddTodo() {
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

function TodoList({ todos }) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <TodoListHeader todos={todos} />
        <TodoListMain todos={todos} />
      </CardContent>
    </Card>
  );
}

function TodoListHeader({ todos }) {
  const [activeFilter, setActiveFilter] = useState("all");

  const total = todos.length;
  const pending = todos.filter((t) => !t.completed).length;
  const completed = todos.filter((t) => t.completed).length;

  return (
    <div className="p-6 border-b flex items-center justify-between">
      <h2 className="text-lg font-semibold">할 일 목록</h2>

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

function TodoListMain({ todos }) {
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
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground"
        >
          <Edit className="w-4 h-4" />
        </Button>
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
