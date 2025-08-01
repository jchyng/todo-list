"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Settings,
  LogOut,
  CheckSquare,
} from "lucide-react";
import { signOut } from "@/app/login/actions";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import SettingsModal from "@/components/SettingsModal";
import { createClient } from "@/lib/supabase/client";

export default function Header() {
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient();
      
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) {
          console.error("Error getting user:", error);
          setUser(null);
          setIsLogin(false);
          return;
        }

        if (user) {
          setUser(user);
          setIsLogin(true);
        } else {
          setUser(null);
          setIsLogin(false);
        }
      } catch (error) {
        console.error("Failed to get user info:", error);
        setUser(null);
        setIsLogin(false);
      }
    };

    getUser();
  }, []);

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
          <button className="flex items-center gap-2">
            <Avatar className="h-8 w-8 rounded-full">
              <AvatarImage src={user?.user_metadata?.avatar_url || ""} alt={user?.user_metadata?.full_name} />
              <AvatarFallback className="rounded-lg">
                {user?.user_metadata?.full_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
          side="bottom"
          sideOffset={4}
          align="end"
        >
          <DropdownMenuLabel className="p-0 font-normal">
            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={user?.user_metadata?.avatar_url || ""}
                  alt={user?.user_metadata?.full_name}
                />
                <AvatarFallback className="rounded-lg">
                  {user?.user_metadata?.full_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {user?.user_metadata?.full_name || user?.email || "사용자"}
                </span>
                <span className="text-muted-foreground truncate text-xs">
                  {user?.email}
                </span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => setSettingsOpen(true)}>
              <Settings className="text-secondary-foreground" />
              <span className="text-secondary-foreground">Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()}>
              <LogOut className="text-red-500" />
              <span className="text-red-500">Logout</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
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
      
      <SettingsModal 
        open={settingsOpen} 
        onOpenChange={setSettingsOpen} 
        user={user} 
      />
    </header>
  );
}
