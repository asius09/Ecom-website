import { supabase } from "@/utils/supabase/client";
import { User } from "@/types/user";

export const createUser = async (
  user: Omit<User, "created_at" | "isAdmin">
): Promise<boolean> => {
  try {
    // First check if user already exists
    const { data: existingUser, error: fetchError } = await supabase
      .from("user")
      .select("*")
      .eq("id", user.id)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      // Ignore "not found" error
      throw fetchError;
    }

    if (existingUser) {
      // If user exists, return true without updating
      return true;
    }

    // If user doesn't exist, create new user
    const { error: userInsertError } = await supabase.from("user").insert([
      {
        id: user.id,
        email: user.email,
        name: user.name,
        is_admin: false,
      },
    ]);

    if (userInsertError) {
      throw userInsertError;
    }

    return true;
  } catch (error) {
    console.error("Error creating user:", error);
    return false;
  }
};

export const updateUser = async (
  userId: string,
  updates: { name: string }
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("user")
      .update({ name: updates.name })
      .eq("id", userId);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error("Error updating user:", error);
    return false;
  }
};

export const fetchUsers = async (): Promise<User[]> => {
  try {
    const { data, error } = await supabase.from("user").select("*");

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};
export const deleteUser = async (userId: string): Promise<boolean> => {
  try {
    const { error } = await supabase.from("user").delete().eq("id", userId);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error("Error deleting user:", error);
    return false;
  }
};
