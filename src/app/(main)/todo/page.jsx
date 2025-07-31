"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { ClipboardList } from "lucide-react";

import { TodoItem } from "@/components/TodoItem";
import data from "./data.json";

import { useState } from "react";

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

  const [dateRange, setDateRange] = useState({ from: null, to: null });

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
        <TodoItem
          key={item.id}
          todo={item}
          onToggleComplete={(id, completed) => {
            console.log("Toggle complete:", id, completed);
            // TODO: API 호출로 완료 상태 업데이트
          }}
          onDelete={(id) => {
            console.log("Delete todo:", id);
            // TODO: API 호출로 삭제
          }}
          onUpdate={(id, updatedData) => {
            console.log("Update todo:", id, updatedData);
            // TODO: API 호출로 업데이트
          }}
        />
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
