"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { ClipboardList } from "lucide-react";

import { TodoItem } from "@/components/TodoItem";
import {
  fetchTodoList,
  createTodo,
  updateTodo,
  deleteTodo,
  toggleTodoComplete,
} from "@/lib/api";

import { useState, useEffect } from "react";

export default function TodoPage() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 할 일 목록 로드
  const loadTodos = async () => {
    try {
      setLoading(true);
      const { todos: todosData } = await fetchTodoList();
      setTodos(todosData);
      setError(null);
    } catch (err) {
      console.error("할 일 로드 실패:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 할 일 추가
  const handleAddTodo = async (todoData) => {
    try {
      const newTodo = await createTodo(todoData);
      setTodos((prev) => [newTodo, ...prev]);
      return newTodo;
    } catch (err) {
      console.error("할 일 추가 실패:", err);
      throw err;
    }
  };

  // 할 일 수정
  const handleUpdateTodo = async (id, updateData) => {
    try {
      const updatedTodo = await updateTodo(id, updateData);
      setTodos((prev) =>
        prev.map((todo) => (todo._id === id ? updatedTodo : todo))
      );
    } catch (err) {
      console.error("할 일 수정 실패:", err);
      throw err;
    }
  };

  // 할 일 삭제
  const handleDeleteTodo = async (id) => {
    try {
      await deleteTodo(id);
      setTodos((prev) => prev.filter((todo) => todo._id !== id));
    } catch (err) {
      console.error("할 일 삭제 실패:", err);
      throw err;
    }
  };

  // 완료 상태 토글
  const handleToggleComplete = async (id) => {
    try {
      const updatedTodo = await toggleTodoComplete(id);
      setTodos((prev) =>
        prev.map((todo) => (todo._id === id ? updatedTodo : todo))
      );
    } catch (err) {
      console.error("완료 상태 변경 실패:", err);
      throw err;
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <CurrentTimeCard />
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">할 일을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <CurrentTimeCard />
      <AddTodoCard onAddTodo={handleAddTodo} />
      <TodoListCard
        todos={todos}
        onUpdateTodo={handleUpdateTodo}
        onDeleteTodo={handleDeleteTodo}
        onToggleComplete={handleToggleComplete}
        error={error}
      />
    </div>
  );
}

function CurrentTimeCard() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return { month, day, hours, minutes };
  };

  const { month, day, hours, minutes } = formatTime(currentTime);

  return (
    <div className="text-center my-12">
      <div className="text-4xl font-mono font-bold text-gray-900 tracking-wider">
        {month}월 {day}일 {hours}:{minutes}
      </div>
    </div>
  );
}

function AddTodoCard({ onAddTodo }) {
  const [task, setTask] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (task.trim() === "" || loading) return; // loading 상태 체크 추가

    try {
      setLoading(true);
      await onAddTodo({ title: task.trim() });
      setTask(""); // 입력 초기화
    } catch (err) {
      alert("할 일 추가에 실패했습니다: " + err.message);
    } finally {
      setLoading(false);
    }
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
            disabled={loading}
            onChange={(e) => setTask(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !loading) {
                e.preventDefault(); // 기본 폼 제출 동작 방지
                handleAdd();
              }
            }}
          />
          <Button onClick={handleAdd} disabled={loading}>
            {loading ? "추가 중..." : "추가"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function TodoListCard({
  todos,
  onUpdateTodo,
  onDeleteTodo,
  onToggleComplete,
  error,
}) {
  const [filteredTodos, setFilteredTodos] = useState(todos);

  // todos가 변경될 때 filteredTodos 초기화
  useEffect(() => {
    setFilteredTodos(todos);
  }, [todos]);

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>
          <div className="flex justify-between items-center">
            <span>작업 목록</span>
            <TodoFilters todos={todos} onFilter={setFilteredTodos} />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 border-t">
        {error && (
          <div className="p-4 bg-red-50 border-b">
            <p className="text-red-600 text-sm">오류: {error}</p>
          </div>
        )}
        <TodoList
          todos={filteredTodos}
          onUpdateTodo={onUpdateTodo}
          onDeleteTodo={onDeleteTodo}
          onToggleComplete={onToggleComplete}
        />
      </CardContent>
    </Card>
  );
}

function TodoFilters({ todos, onFilter }) {
  const [activeFilter, setActiveFilter] = useState("all");

  const total = todos.length;
  const pending = todos.filter((t) => !t.completed).length;
  const completed = todos.filter((t) => t.completed).length;

  // 필터링 로직
  const applyFilter = (filterType) => {
    setActiveFilter(filterType);
    
    let filtered;
    switch (filterType) {
      case "pending":
        filtered = todos.filter((t) => !t.completed);
        break;
      case "completed":
        filtered = todos.filter((t) => t.completed);
        break;
      case "all":
      default:
        filtered = todos;
        break;
    }
    
    onFilter(filtered);
  };

  // todos가 변경될 때 현재 필터 다시 적용
  useEffect(() => {
    applyFilter(activeFilter);
  }, [todos]);

  return (
    <div className="flex items-center gap-2">
      <FilterButton
        active={activeFilter === "all"}
        color="blue"
        label="전체"
        count={total}
        onClick={() => applyFilter("all")}
      />
      <FilterButton
        active={activeFilter === "pending"}
        color="amber"
        label="진행중"
        count={pending}
        onClick={() => applyFilter("pending")}
      />
      <FilterButton
        active={activeFilter === "completed"}
        color="emerald"
        label="완료"
        count={completed}
        onClick={() => applyFilter("completed")}
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

function TodoList({ todos, onUpdateTodo, onDeleteTodo, onToggleComplete }) {
  if (todos.length === 0) return <EmptyState />;

  return (
    <div className="divide-y">
      {todos.map((item) => (
        <TodoItem
          key={item._id}
          todo={item}
          onToggleComplete={onToggleComplete}
          onDelete={onDeleteTodo}
          onUpdate={onUpdateTodo}
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
