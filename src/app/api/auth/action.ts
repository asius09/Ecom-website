"use server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { createUser } from "../user/action";

export async function login(formData: FormData): Promise<boolean> {
  try {
    const supabase = await createClient();

    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    console.log("Attempting login for:", data.email);

    const { error } = await supabase.auth.signInWithPassword(data);

    if (error) {
      console.error("Login error:", error.message);
      throw error;
    }

    console.log("Login successful for:", data.email);
    revalidatePath("/", "layout");
    return true; // Return true instead of redirecting
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
}

export async function signup(formData: FormData): Promise<boolean> {
  try {
    const supabase = await createClient();
    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      name: formData.get("name") as string,
    };

    console.log("Attempting signup for:", data.email);

    const { data: signupData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          name: data.name,
        },
      },
    });

    if (error) {
      console.error("Signup error:", error.message);
      throw error;
    }

    if (signupData.user) {
      await createUser({
        id: signupData.user.id,
        email: signupData.user.email!,
        name: data.name,
      });
    }

    console.log("Signup successful for:", data.email);
    revalidatePath("/", "layout");
    return true; // Return true instead of redirecting
  } catch (error) {
    console.error("Signup failed:", error);
    throw error;
  }
}

export async function signout() {
  try {
    const supabase = await createClient();
    console.log("Attempting signout");
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    console.log("Signout successful");
    return true; // Return true instead of redirecting
  } catch (error) {
    console.log("Signout Failed : ", error);
    return false;
  }
}

export async function validAdmin(): Promise<boolean> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.log("No user found, redirecting");
      return false;
    }

    console.log("Checking admin status for user:", user.id);
    const { data: userData } = await supabase
      .from("user")
      .select("is_admin")
      .eq("id", user.id)
      .single();

    if (userData?.is_admin) {
      console.log("User is admin");
      return true;
    }

    console.log("User is not admin");
    return false;
  } catch (error) {
    console.error("Admin validation failed:", error);
    return false;
  }
}
