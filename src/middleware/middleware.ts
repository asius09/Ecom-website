import { type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/dashboard/:path*", // protects /dashboard and all nested routes
    "/account/:path*", // protects /account/*
    "/cart/:path*", // protects /cart/*
    "/wishlist/:path*", // protects /wishlist/*
  ],
};
