"use server";

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    throw error;
  } else {
    revalidatePath("/", "layout");
    redirect("/");
  }
}

export async function signup(formData: FormData) {
  const supabase = await createClient();
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signUp(data);
  if (error) {
    throw error;
  } else {
    revalidatePath("/", "layout");
    redirect("/");
  }
}

export async function signout() {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    redirect("/");
  } catch (error) {
    console.log("Signout Failed : ", error);
  }
}

export async function validAdmin(): Promise<boolean> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const { data: userDetails } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (userDetails?.role === "admin") return true;

  return false;
}
