"use client";
import { supabase } from "@/utils/supabase/client";
/**
 * Uploads an image to Supabase Storage and returns the public URL.
 * @param file File to upload
 * @returns public image URL (or null if error)
 */
export async function uploadImage(file: File): Promise<string | null> {
  if (!file) {
    return null;
  }

  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("product")
    .upload(filePath, file);

  if (uploadError) {
    return null;
  }

  const { data: publicUrlData } = supabase.storage
    .from("product")
    .getPublicUrl(filePath);

  return publicUrlData?.publicUrl || null;
}
