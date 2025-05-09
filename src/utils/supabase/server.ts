import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient({
  isAdmin = false,
}: { isAdmin?: boolean } = {}) {
  const cookieStore = await cookies();
  const nextKey = isAdmin
    ? process.env.NEXT_SECRET_SUPABASE_SERVICE_ROLE_KEY!
    : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, nextKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  });
}
