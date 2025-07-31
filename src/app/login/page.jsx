"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { googleLogin } from "./actions";
import { AlertTriangle } from "lucide-react";

export default function LoginPage() {
  const [agreed, setAgreed] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const formRef = useRef(null);

  const handleLoginClick = (e) => {
    if (!agreed) {
      e.preventDefault();
      setShowAlert(true);
    } else {
      formRef.current.requestSubmit();
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <Card className="w-[400px] shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold tracking-tight">
            Todo-list 로그인
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6 items-center">
          <p className="text-center text-gray-600">
            Google 계정으로 간편하게 로그인하세요.
          </p>
          {showAlert && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>동의 필요</AlertTitle>
              <AlertDescription>
                로그인을 계속하려면 개인정보 수집 및 이용에 동의해야 합니다.
              </AlertDescription>
            </Alert>
          )}
          <form ref={formRef} action={googleLogin} className="w-full">
            <Button
              type="button"
              variant="outline"
              className="w-full flex items-center justify-center gap-3 py-6 text-lg"
              onClick={handleLoginClick}
            >
              <svg
                className="h-6 w-6"
                viewBox="0 0 533.5 544.3"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M533.5 278.4c0-18.6-1.6-37.3-5.1-55.4H272.1v104.9h147.5c-6.3 34.1-25.1 63.1-53.5 82.5v68.3h86.2c50.4-46.4 81.2-114.9 81.2-200.3z"
                  fill="#4285f4"
                />
                <path
                  d="M272.1 544.3c72.6 0 133.6-23.9 178.1-64.9l-86.2-68.3c-24 16.1-54.7 25.5-91.9 25.5-70.5 0-130.2-47.6-151.7-111.5H30.1v70.1c44.9 89.1 137.2 149.1 242 149.1z"
                  fill="#34a853"
                />
                <path
                  d="M120.4 325.1c-10.8-31.6-10.8-65.7 0-97.3V157.7H30.1c-39.9 79.8-39.9 173.8 0 253.6l90.3-70.2z"
                  fill="#fbbc04"
                />
                <path
                  d="M272.1 107.7c38.9 0 73.8 13.4 101.2 39.7l75.7-75.7C405.7 24.1 344.7 0 272.1 0 167.3 0 75 60 30.1 149.1l90.3 70.1c21.6-63.9 81.2-111.5 151.7-111.5z"
                  fill="#ea4335"
                />
              </svg>
              Google 계정으로 로그인
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms"
              checked={agreed}
              onCheckedChange={() => setAgreed(!agreed)}
            />
            <Label htmlFor="terms" className="text-sm text-gray-600">
              [필수]{" "}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="link" className="p-0 h-auto">
                    개인정보 수집 및 이용
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      개인정보 수집 및 이용 동의
                    </AlertDialogTitle>
                    <AlertDialogDescription asChild>
                      <div className="space-y-2 text-left">
                        <p>
                          Todo-list 서비스는 다음의 목적을 위해 개인정보를
                          수집 및 이용합니다.
                        </p>
                        <p>
                          <strong>1. 수집하는 개인정보 항목</strong>
                          <br />- Google 계정 정보: 이메일 주소, 프로필 사진,
                          이름
                        </p>
                        <p>
                          <strong>2. 개인정보의 수집 및 이용 목적</strong>
                          <br />- 회원 식별 및 서비스 이용을 위한 인증
                          <br />- Todo-list 데이터(할 일, 일정 등) 저장 및 연동
                        </p>
                        <p>
                          <strong>3. 개인정보의 보유 및 이용 기간</strong>
                          <br />- 회원 탈퇴 시까지 보유하며, 탈퇴 요청 시
                          즉시 파기합니다.
                        </p>
                      </div>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogAction>확인</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              에 대한 동의
            </Label>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}