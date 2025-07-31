"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Calendar, Sparkles, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import NumberTicker from "@/components/magicui/number-ticker";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 py-24 sm:py-32 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.100),transparent)] dark:bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.900),transparent)]" />
        <div className="relative mx-auto max-w-2xl text-center">
          <motion.div 
            className="mb-8 flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20 dark:text-gray-300 dark:ring-gray-100/10 dark:hover:ring-gray-100/20 transition-all duration-300 hover:scale-105">
              ✨ 구글 계정으로 간편하게 시작하세요
            </div>
          </motion.div>
          <motion.h1 
            className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            똑똑한 할 일 관리로
            <span className="text-indigo-600 dark:text-indigo-400"> 생산성을 높이세요</span>
          </motion.h1>
          <motion.p 
            className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            직관적인 인터페이스와 강력한 기능으로 일상의 할 일들을 체계적으로 관리하고, 
            목표를 달성하는 성취감을 경험해보세요.
          </motion.p>
          <motion.div 
            className="mt-10 flex items-center justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link href="/login">
              <Button size="lg" className="rounded-full px-8 py-6 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1">
                시작하기
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600 dark:text-indigo-400">강력한 기능</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              효율적인 할 일 관리의 모든 것
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              일상의 복잡함을 간단하고 체계적으로 관리할 수 있는 모든 도구를 제공합니다.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <motion.div 
                className="flex flex-col"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 hover:scale-105 hover:-translate-y-2">
                  <CardHeader>
                    <motion.div 
                      className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-600"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <CheckCircle className="h-6 w-6 text-white" />
                    </motion.div>
                    <CardTitle className="text-xl">스마트 할 일 관리</CardTitle>
                    <CardDescription>
                      직관적인 인터페이스로 할 일을 쉽게 추가, 수정, 완료할 수 있습니다.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
              <motion.div 
                className="flex flex-col"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 hover:scale-105 hover:-translate-y-2">
                  <CardHeader>
                    <motion.div 
                      className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-600"
                      whileHover={{ scale: 1.1, rotate: -5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Calendar className="h-6 w-6 text-white" />
                    </motion.div>
                    <CardTitle className="text-xl">달력 통합</CardTitle>
                    <CardDescription>
                      월별 캘린더 뷰로 할 일을 시각적으로 관리하고 진행 상황을 한눈에 확인하세요.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
              <motion.div 
                className="flex flex-col"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 hover:scale-105 hover:-translate-y-2">
                  <CardHeader>
                    <motion.div 
                      className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-600"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Sparkles className="h-6 w-6 text-white" />
                    </motion.div>
                    <CardTitle className="text-xl">실시간 동기화</CardTitle>
                    <CardDescription>
                      모든 기기에서 실시간으로 동기화되는 할 일 목록으로 언제 어디서나 접근하세요.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            </dl>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white dark:bg-slate-800 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                이미 많은 사용자들이 선택했습니다
              </h2>
              <p className="mt-4 text-lg leading-8 text-gray-600 dark:text-gray-300">
                매일 수천 명의 사용자가 우리와 함께 생산성을 높이고 있습니다
              </p>
            </div>
            <dl className="mt-16 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-4">
              <motion.div 
                className="flex flex-col bg-gray-400/5 p-8 hover:bg-gray-400/10 transition-colors duration-300"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <dt className="text-sm font-semibold leading-6 text-gray-600 dark:text-gray-300">활성 사용자</dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
                  <NumberTicker value={10000} delay={0.5} />+
                </dd>
              </motion.div>
              <motion.div 
                className="flex flex-col bg-gray-400/5 p-8 hover:bg-gray-400/10 transition-colors duration-300"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <dt className="text-sm font-semibold leading-6 text-gray-600 dark:text-gray-300">완료된 할 일</dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
                  <NumberTicker value={500000} delay={0.7} />+
                </dd>
              </motion.div>
              <motion.div 
                className="flex flex-col bg-gray-400/5 p-8 hover:bg-gray-400/10 transition-colors duration-300"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <dt className="text-sm font-semibold leading-6 text-gray-600 dark:text-gray-300">생산성 향상</dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
                  <NumberTicker value={40} delay={0.9} />%
                </dd>
              </motion.div>
              <motion.div 
                className="flex flex-col bg-gray-400/5 p-8 hover:bg-gray-400/10 transition-colors duration-300"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <dt className="text-sm font-semibold leading-6 text-gray-600 dark:text-gray-300">만족도</dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
                  <NumberTicker value={98} delay={1.1} />%
                </dd>
              </motion.div>
            </dl>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative isolate overflow-hidden bg-indigo-600 px-6 py-24 sm:py-32 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.100),transparent)] opacity-20" />
        <div className="mx-auto max-w-2xl text-center">
          <motion.h2 
            className="text-3xl font-bold tracking-tight text-white sm:text-4xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            지금 바로 시작하세요
          </motion.h2>
          <motion.p 
            className="mx-auto mt-6 max-w-xl text-lg leading-8 text-indigo-200"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            구글 계정으로 간편하게 로그인하고 생산성을 높이는 새로운 경험을 시작해보세요. 
            복잡한 설정 없이 바로 사용할 수 있습니다.
          </motion.p>
          <motion.div 
            className="mt-10 flex items-center justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Link href="/login">
              <Button 
                variant="secondary" 
                size="lg" 
                className="rounded-full px-8 py-6 text-base font-semibold bg-white text-indigo-600 hover:bg-gray-50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1"
              >
                로그인하기
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="text-center">
            <p className="text-xs leading-5 text-gray-500 dark:text-gray-400">
              &copy; 2024 ToDoList. 모든 권리 보유.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
