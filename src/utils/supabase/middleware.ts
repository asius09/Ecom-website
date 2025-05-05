import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

export async function updateSession(request: NextRequest) {
  // Create an initial "pass-through" response
  const response = NextResponse.next({ request });

  // Create Supabase server client (bound to request + response cookies)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Refresh user if needed
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If not logged in and trying to access protected route → redirect
  const isAuthRoute =
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/auth") ||
    request.nextUrl.pathname.startsWith("/signup");

  if (session && isAuthRoute) {
    const isAdmin = session.user.user_metadata.is_admin;
    console.log("Is user admin?", isAdmin);
    if (isAdmin && !request.nextUrl.pathname.startsWith("/admin")) {
      console.log("Redirecting admin to admin dashboard");
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      return NextResponse.redirect(url);
    }
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  if (!session && !isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Return the final response (with any updated cookies)
  return response;
}
