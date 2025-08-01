"use client";

import { useState, useEffect } from "react";
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
  RotateCcw,
} from "lucide-react";
import { LoadingSpinner, LoadingOverlay } from "@/components/ui/loading";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { toast } from "sonner";

// Reusable TodoItem component
export function TodoItem({ todo, onToggleComplete, onDelete, onUpdate }) {
  const { title, description, completed, dueDate, updatedAt } = todo;
  
  // 낙관적 UI를 위한 로컬 상태
  const [optimisticCompleted, setOptimisticCompleted] = useState(completed);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [justCompleted, setJustCompleted] = useState(false);

  // prop이 변경될 때 낙관적 상태 동기화
  useEffect(() => {
    setOptimisticCompleted(completed);
  }, [completed]);

  const handleToggleComplete = async () => {
    if (!onToggleComplete || isUpdating) return;

    const newCompleted = !optimisticCompleted;
    
    // 즉시 UI 업데이트 (낙관적)
    setOptimisticCompleted(newCompleted);
    setIsUpdating(true);
    

    try {
      // 비동기 API 호출
      await onToggleComplete(todo._id, newCompleted);
      
      // 성공 시 토스트 표시
      if (newCompleted) {
        toast.success('할 일을 완료했습니다! 🎉', {
          duration: 2000,
        });
      }
    } catch (error) {
      // 실패 시 롤백
      setOptimisticCompleted(completed);
      console.error('할 일 상태 변경 실패:', error);
      toast.error('할 일 상태 변경에 실패했습니다', {
        description: error?.message || '잠시 후 다시 시도해주세요',
        duration: 4000,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete || isDeleting) return;
    
    try {
      setIsDeleting(true);
      await onDelete(todo._id);
    } catch (error) {
      console.error('할 일 삭제 실패:', error);
      toast.error('할 일 삭제에 실패했습니다', {
        description: error?.message || '잠시 후 다시 시도해주세요',
        duration: 4000,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <LoadingOverlay loading={isDeleting} className="group">
      <div className={`p-6 hover:bg-muted/50 transition-all duration-500 flex items-start gap-4 ${isDeleting ? "opacity-50" : ""}`}>
      {/* 체크박스 */}
      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          className={`w-5 h-5 p-0 rounded flex items-center justify-center transition-all duration-300 ${
            optimisticCompleted 
              ? "bg-emerald-500 shadow-lg shadow-emerald-200/60 hover:bg-emerald-600 hover:shadow-emerald-300/60" 
              : "border-2 border-muted-foreground/30 hover:border-emerald-300"
          } ${isUpdating ? "opacity-75" : ""}`}
          onClick={handleToggleComplete}
          disabled={isUpdating || isDeleting}
        >
          {isUpdating ? (
            <LoadingSpinner size="sm" className="w-3 h-3 text-white" />
          ) : optimisticCompleted ? (
            <Check 
              className="w-3 h-3 text-white transition-all duration-200"
            />
          ) : null}
        </Button>
        
      </div>

      {/* 본문 */}
      <EditTodoDialog todo={todo} onUpdate={onUpdate}>
        <div className="flex-1 min-w-0 cursor-pointer">
          <p
            className={`font-medium transition-all duration-500 ease-out ${
              optimisticCompleted 
                ? "line-through text-muted-foreground opacity-70" 
                : "text-foreground opacity-100"
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
          variant={optimisticCompleted ? "default" : "secondary"}
          className={`transition-all duration-500 ease-out ${
            optimisticCompleted
              ? "bg-emerald-100 text-emerald-800 shadow-md shadow-emerald-100/50"
              : "bg-amber-100 text-amber-800"
          } ${isUpdating ? "opacity-75" : ""}`}
        >
          {optimisticCompleted ? "완료" : "진행중"}
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
                className="bg-red-500 hover:bg-red-600 disabled:opacity-50"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    삭제 중...
                  </>
                ) : (
                  "삭제"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
    </LoadingOverlay>
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
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (isSaving) return;
    
    try {
      setIsSaving(true);
      if (onUpdate) {
        await onUpdate(todo._id, form);
      }
      setIsOpen(false);
    } catch (err) {
      toast.error('할 일 수정에 실패했습니다', {
        description: err?.message || '잠시 후 다시 시도해주세요',
        duration: 4000,
      });
    } finally {
      setIsSaving(false);
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
    
    // 현재 시간보다 이전으로 설정하려고 하면 현재 시간으로 설정
    const now = new Date();
    if (updated < now) {
      const currentTime = new Date();
      setForm({ ...form, [field]: currentTime });
    } else {
      setForm({ ...form, [field]: updated });
    }
  };

  // 오늘 날짜인 경우 현재 시간 이후의 시간만 표시
  const getAvailableTimeOptions = () => {
    if (!form.dueDate) return timeOptions;
    
    const selectedDate = new Date(form.dueDate);
    const today = new Date();
    
    // 선택된 날짜가 오늘이 아니면 모든 시간 옵션 반환
    if (selectedDate.toDateString() !== today.toDateString()) {
      return timeOptions;
    }
    
    // 오늘인 경우 현재 시간 이후만 반환
    const currentHour = today.getHours();
    const currentMinute = today.getMinutes();
    
    return timeOptions.filter(time => {
      const [h, m] = time.split(":").map(Number);
      return h > currentHour || (h === currentHour && m >= currentMinute);
    });
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
              disabled={isSaving}
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
              disabled={isSaving}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="할 일에 대한 설명을 입력하세요"
            />
          </div>

          {/* 마감 날짜 & 시간 */}
          <div className="grid gap-2">
            <div className="flex items-center gap-2">
              <Label>마감 날짜</Label>
              {form.dueDate && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-5 w-5 p-0 text-muted-foreground hover:text-blue-500 transition-colors"
                  onClick={() => setForm({ ...form, dueDate: null })}
                  title="마감날짜 초기화"
                >
                  <RotateCcw className="h-3 w-3" />
                </Button>
              )}
            </div>
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
                    onSelect={(date) => {
                      if (!date) {
                        setForm({ ...form, dueDate: date });
                        return;
                      }

                      const selectedDate = new Date(date);
                      const today = new Date();
                      
                      // 모든 날짜를 23:30으로 설정
                      selectedDate.setHours(23, 30, 0, 0);
                      
                      setForm({ ...form, dueDate: selectedDate });
                    }}
                    initialFocus
                    locale={ko}
                    disabled={(date) => {
                      const today = new Date();
                      const now = new Date();
                      
                      // 오늘 날짜인 경우 현재 시간이 23:30을 넘었는지 확인
                      if (date.toDateString() === today.toDateString()) {
                        const currentHour = now.getHours();
                        const currentMinute = now.getMinutes();
                        // 23:30 이후면 오늘 날짜 비활성화
                        if (currentHour > 23 || (currentHour === 23 && currentMinute >= 30)) {
                          return true;
                        }
                      }
                      
                      // 과거 날짜는 비활성화
                      today.setHours(0, 0, 0, 0);
                      return date < today;
                    }}
                  />
                </PopoverContent>
              </Popover>
              <Select
                value={form.dueDate ? format(form.dueDate, "HH:mm") : ""}
                onValueChange={(val) => handleTimeChange("dueDate", val)}
                disabled={!form.dueDate}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="시간 선택" />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableTimeOptions().map((t) => (
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
            disabled={isSaving}
          >
            취소
          </Button>
          <Button type="button" onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                저장 중...
              </>
            ) : (
              "저장"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
