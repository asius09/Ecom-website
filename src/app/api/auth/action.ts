"use server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { createUser } from "../user/action";
import { User } from "@/types/user";

export async function login(
  formData: FormData
): Promise<{ success: boolean; data?: any }> {
  try {
    const supabase = await createClient();

    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    const { data: authData, error } =
      await supabase.auth.signInWithPassword(data);

    if (error) {
      throw error;
    }

    revalidatePath("/", "layout");
    return { success: true, data: authData };
  } catch (error) {
    return { success: false, data: error };
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
      throw error;
    }

    if (signupData.user) {
      await createUser({
        id: signupData.user.id,
        email: signupData.user.email!,
        name: data.name,
        is_admin: false,
      });
    }

    revalidatePath("/", "layout");
    return true;
  } catch (error) {
    throw error;
  }
}

export async function signout() {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return true;
  } catch (error) {
    return false;
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    const { data: userData, error } = await supabase
      .from("user")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) throw error;
    return userData;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

export async function getAllUsers(isAdmin: boolean): Promise<User[]> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("User not authenticated");
    }

    // Check if user is admin
    const { data: userData } = await supabase
      .from("user")
      .select("is_admin")
      .eq("id", user.id)
      .single();

    if (userData?.is_admin) {
      const { data: users, error } = await supabase.from("user").select("*");

      if (error) throw error;
      return users || [];
    }

    // Regular users can only get their own data
    const { data: singleUser, error } = await supabase
      .from("user")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) throw error;
    return singleUser ? [singleUser] : [];
  } catch (error) {
    console.error("Error getting users:", error);
    return [];
  }
}
