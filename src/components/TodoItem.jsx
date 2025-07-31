"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Check,
  BadgeCheck,
  AlarmCheck,
  CalendarIcon,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

// Reusable TodoItem component
export function TodoItem({ todo, onToggleComplete, onDelete, onUpdate }) {
  const { title, description, completed, dueDate, updatedAt } = todo;

  const handleToggleComplete = () => {
    if (onToggleComplete) {
      onToggleComplete(todo._id, !completed);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(todo._id);
    }
  };

  return (
    <div className="p-6 hover:bg-muted/50 transition-colors flex items-start gap-4">
      {/* 체크박스 */}
      <Button
        variant="ghost"
        size="sm"
        className={`w-5 h-5 p-0 rounded flex items-center justify-center ${
          completed ? "bg-emerald-500" : "border-2 border-muted-foreground/30"
        }`}
        onClick={handleToggleComplete}
      >
        {completed && <Check className="w-3 h-3 text-white" />}
      </Button>

      {/* 본문 */}
      <EditTodoDialog todo={todo} onUpdate={onUpdate}>
        <div className="flex-1 min-w-0 cursor-pointer">
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
      </EditTodoDialog>

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
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-red-500"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>정말 삭제하시겠습니까?</AlertDialogTitle>
              <AlertDialogDescription>
                이 작업은 되돌릴 수 없습니다. 정말로 이 작업을 삭제하시겠습니까?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>취소</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-500 hover:bg-red-600"
                onClick={handleDelete}
              >
                삭제
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

function EditTodoDialog({ todo, children, onUpdate }) {
  const [form, setForm] = useState({
    title: todo.title || "",
    description: todo.description || "",
    completed: todo.completed || false,
    startDate: todo.startDate ? new Date(todo.startDate) : null,
    dueDate: todo.dueDate ? new Date(todo.dueDate) : null,
  });
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = async () => {
    try {
      if (onUpdate) {
        await onUpdate(todo._id, form);
      }
      setIsOpen(false);
    } catch (err) {
      alert("할 일 수정에 실패했습니다: " + err.message);
    }
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
          >
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
