"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { motion } from "motion/react";
import { googleLogin } from "./actions";
import { toast } from "sonner";

export default function LoginPage() {
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef(null);

  const handleLoginClick = (e) => {
    if (!agreed) {
      e.preventDefault();
      toast.error("개인정보 수집 및 이용에 동의해야 합니다.");
    } else {
      setIsLoading(true);
      formRef.current.requestSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.100),transparent)] dark:bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.900),transparent)]" />
      
      {/* Back Button */}
      <div className="relative z-10 p-6">
        <Link href="/" className="inline-flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          메인으로 돌아가기
        </Link>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex min-h-[calc(100vh-96px)] items-center justify-center px-6">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600 shadow-lg">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
              환영합니다!
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              구글 계정으로 간편하게 시작하세요
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                  로그인
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
                    할 일을 체계적으로 관리하고 생산성을 높여보세요
                  </p>
                  
                  <form ref={formRef} action={googleLogin} className="space-y-4">
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      className="w-full flex items-center justify-center gap-3 py-6 text-base font-medium border-2 hover:border-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-all duration-300 hover:scale-105"
                      onClick={handleLoginClick}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <svg
                            className="animate-spin h-5 w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          로그인 중...
                        </>
                      ) : (
                        <>
                          <svg
                            className="h-5 w-5"
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
                        </>
                      )}
                    </Button>
                  </form>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="terms"
                      checked={agreed}
                      onCheckedChange={() => setAgreed(!agreed)}
                      className="mt-0.5"
                    />
                    <Label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                      [필수]{" "}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="link"
                            className="p-0 h-auto text-indigo-600 dark:text-indigo-400 underline font-medium hover:text-indigo-700 dark:hover:text-indigo-300"
                          >
                            개인정보 수집 및 이용
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-xl font-semibold">
                              개인정보 수집 및 이용 동의
                            </AlertDialogTitle>
                            <AlertDialogDescription asChild>
                              <div className="space-y-4 text-left text-sm text-gray-700 dark:text-gray-300">
                                <p className="font-medium text-gray-900 dark:text-white">
                                  Todo-list 서비스는 다음의 목적을 위해 개인정보를 수집 및 이용합니다.
                                </p>
                                <div className="space-y-3">
                                  <div>
                                    <p className="font-semibold text-gray-900 dark:text-white mb-1">
                                      1. 수집하는 개인정보 항목
                                    </p>
                                    <p>- Google 계정 정보: 이메일 주소, 프로필 사진, 이름</p>
                                  </div>
                                  <div>
                                    <p className="font-semibold text-gray-900 dark:text-white mb-1">
                                      2. 개인정보의 수집 및 이용 목적
                                    </p>
                                    <p>- 회원 식별 및 서비스 이용을 위한 인증</p>
                                    <p>- Todo-list 데이터(할 일, 일정 등) 저장 및 연동</p>
                                  </div>
                                  <div>
                                    <p className="font-semibold text-gray-900 dark:text-white mb-1">
                                      3. 개인정보의 보유 및 이용 기간
                                    </p>
                                    <p>- 회원 탈퇴 시까지 보유하며, 탈퇴 요청 시 즉시 파기합니다.</p>
                                  </div>
                                </div>
                              </div>
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogAction className="bg-indigo-600 hover:bg-indigo-700">
                              확인
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      에 대한 동의
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-8"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400">
              로그인하면 서비스 이용약관 및 개인정보처리방침에 동의하게 됩니다.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
