import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({
        error: "No email or password present in the request body",
        status: 400,
        statusText: "failed",
      });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json({
        data: null,
        error: error.message,
        status: error.status ?? 400,
        statusText: "failed",
      });
    }

    // Check if user exists in the users table
    const { data: userData } = await supabase
      .from("users")
      .select("id")
      .eq("email", data.user?.email)
      .single();

    if (!userData) {
      await supabase.from("users").insert([
        {
          id: data.user.id, // must match auth.uid()
          email: data.user.email,
          name: data.user.user_metadata.name,
          is_admin: data.user.user_metadata.is_admin || false,
          created_at: data.user.created_at,
        },
      ]);
    }

    // On Success, supabase set cookies for session
    return NextResponse.json({
      data: data.user,
      status: 200,
      statusText: "success",
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    const statusCode =
      error instanceof Error && "status" in error ? Number(error.status) : 500;

    return NextResponse.json({
      data: null,
      error: `Failed to login: ${errorMessage}`,
      status: statusCode,
      statusText: "failed",
    });
  }
}
