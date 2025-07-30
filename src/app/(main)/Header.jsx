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
  const isLogin = true; // TODO: 로그인 여부를 확인하는 로직 필요
  const pathname = usePathname();

  function NavLink({ href, name }) {
    return (
      <Link href={href} className="p-2">
        <span
          className={`text-base transition-colors duration-200 ${
            pathname === href
              ? "text-primary font-bold"
              : "text-muted-foreground font-medium hover:text-foreground"
          }`}
        >
          {name}
        </span>
      </Link>
    );
  }

  function NavLinks({ pathname }) {
    return (
      <nav className="flex items-center gap-6">
        <NavLink href="/todo" name="Todo" />
        <NavLink href="/calendar" name="Calendar" />
      </nav>
    );
  }

  function UserMenu() {
    return (
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
    );
  }

  function LoginButton() {
    return (
      <Link href="/login">
        <Button variant="outline" size="sm" className="rounded-full">
          로그인
        </Button>
      </Link>
    );
  }

  return (
    <header className="w-full">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-24">
          <Link href="/" className="flex items-center gap-2">
            <CheckSquare className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-bold">TodoList</h1>
          </Link>
          <NavLinks pathname={pathname} />
        </div>
        {isLogin ? <UserMenu /> : <LoginButton />}
      </div>
    </header>
  );
}
