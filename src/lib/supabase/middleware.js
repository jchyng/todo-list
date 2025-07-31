import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function updateSession(request) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  if (user) {
    const userInfo = {
      id: user.id,
      avatar_url: user.user_metadata.avatar_url,
      email: user.email,
      full_name: user.user_metadata.full_name,
    };

    supabaseResponse.cookies.set("user_info", JSON.stringify(userInfo), {
      httpOnly: false, // 클라이언트에서 접근 가능
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7일
    });

    if (path === "/login" || path === "/") return redirect(request, "/todo");
  } else {
    supabaseResponse.cookies.delete("user_info");

    if (!path.startsWith("/login")) return redirect(request, "/login");
  }

  return supabaseResponse;
}

function redirect(request, path) {
  const url = request.nextUrl.clone();
  url.pathname = path;
  return NextResponse.redirect(url);
}
