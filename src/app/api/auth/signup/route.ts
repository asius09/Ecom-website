import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { email, password, name } = await request.json();

    // First check if user exists in the users table
    const { data: existingUser, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    // If user exists, return error
    if (existingUser) {
      console.log("user is existed");
      return NextResponse.json({
        error: "User with this email already exists",
        status: 409, // 409 Conflict is more appropriate for existing resource
        statusText: "failed",
      });
    }

    // If user doesn't exist, proceed with signup
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          is_admin: false,
        },
      },
    });

    if (error) {
      return NextResponse.json({
        error: error.message,
        status: error.status || 400,
        statusText: "failed",
      });
    }

    // If signup successful, create user in users table with the same id
    if (data.user) {
      const { error: insertError } = await supabase.from("users").insert({
        id: data.user.id,
        email: data.user.email,
        name,
        is_admin: false,
        created_at: new Date().toISOString(),
      });

      // if (insertError) {
      //   throw insertError;
      // }
    }

    // On successful signup
    return NextResponse.json({
      data: {
        ...data.user,
        id: data.user?.id, // Ensure id is included in the response
      },
      status: 201, // 201 Created for successful resource creation
      statusText: "success",
    });
  } catch (error: any) {
    return NextResponse.json({
      error: error.message || "Internal server error",
      status: 500,
      statusText: "failed",
    });
  }
}
