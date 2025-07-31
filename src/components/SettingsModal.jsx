"use client";

import { useState } from "react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Calendar, Trash2 } from "lucide-react";

export default function SettingsModal({ open, onOpenChange, user }) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDeleteAccount = () => {
    // TODO: 실제 계정 삭제 로직 구현
    console.log("계정 삭제 요청");
    setDeleteDialogOpen(false);
    onOpenChange(false);
  };

  const formatJoinDate = (createdAt) => {
    if (!createdAt) return "정보 없음";
    try {
      const date = new Date(createdAt);
      return format(date, "yyyy년 MM월 dd일", { locale: ko });
    } catch (error) {
      return "정보 없음";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>설정</DialogTitle>
          <DialogDescription>
            계정 정보를 확인하고 설정을 관리하세요.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* 가입 날짜 */}
          <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1">
              <h3 className="font-medium text-sm">가입 날짜</h3>
              <p className="text-sm text-muted-foreground">
                {formatJoinDate(user?.created_at)}
              </p>
            </div>
          </div>

          <Separator />

          {/* 계정 삭제 */}
          <div className="flex items-center gap-3 p-4 rounded-lg bg-red-50 dark:bg-red-950/20">
            <Trash2 className="h-5 w-5 text-red-500" />
            <div className="flex-1">
              <h3 className="font-medium text-sm text-red-700 dark:text-red-400">
                계정 삭제
              </h3>
              <p className="text-sm text-red-600 dark:text-red-500">
                계정을 영구적으로 삭제합니다. 이 작업은 되돌릴 수 없습니다.
              </p>
            </div>
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  삭제
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>계정을 삭제하시겠습니까?</AlertDialogTitle>
                  <AlertDialogDescription>
                    이 작업은 되돌릴 수 없습니다. 계정과 관련된 모든 데이터가 영구적으로 삭제됩니다.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>취소</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAccount}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    삭제
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}