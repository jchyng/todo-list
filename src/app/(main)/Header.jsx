"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MountainIcon, Settings, LogOut, CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="flex h-16 w-full items-center justify-between my-6">
      <div className="flex items-center gap-12">
        <Link href="/" className="flex items-center gap-2 p-2">
          <CheckSquare className="h-8 w-8 text-blue-600" />
          <h1 className="text-xl font-bold">TodoList</h1>
        </Link>
        <nav className="hidden md:flex items-center gap-12">
          <Link href="/todo" className="p-2">
            <span
              className={`text-base font-medium transition-colors duration-200 cursor-pointer ${
                pathname === "/todo"
                  ? "text-blue-600"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Todo
            </span>
          </Link>

          <Link href="/calendar" className="p-2">
            <span
              className={`text-base font-medium transition-colors duration-200 cursor-pointer ${
                pathname === "/calendar"
                  ? "text-blue-600"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Calendar
            </span>
          </Link>
        </nav>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>설정</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <LogOut className="mr-2 h-4 w-4 text-red-400" />
            <span className="text-red-400">로그아웃</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
