/* 미들웨어는 서버 사이드에서 실행되기 때문에 클라이언트 사이드의 컴포넌트를 사용할 수 없다  => ex) authStore */

import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request) {
  return await updateSession(request);
}

/** 미들웨어가 적용되는 경로 (예약된 변수로 config라는 이름을 Next.js 런타임이 읽어서 사용) */
export const config = {
  matcher: ["/", "/login", "/todo/:path*", "/calendar/:path*"],
};
