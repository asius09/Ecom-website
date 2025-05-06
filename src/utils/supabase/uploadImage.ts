"use client";
import { supabase } from "@/utils/supabase/client";
import { toast } from "sonner";

/**
 * Uploads an image to Supabase Storage and returns the public URL.
 * @param file File to upload
 * @returns public image URL (or null if error)
 */
export async function uploadImage(file: File): Promise<string | null> {
  if (!file) {
    toast.error("No file provided for upload");
    return null;
  }

  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`;

  try {
    const { error: uploadError } = await supabase.storage
      .from("products")
      .upload(filePath, file);

    if (uploadError) {
      toast.error("Failed to upload image to storage");
      console.error("Upload error:", uploadError);
      return null;
    }

    const { data: publicUrlData } = supabase.storage
      .from("products")
      .getPublicUrl(filePath);

    if (!publicUrlData?.publicUrl) {
      toast.error("Failed to generate public URL");
      return null;
    }

    return publicUrlData.publicUrl;
  } catch (error) {
    toast.error("An unexpected error occurred during image upload");
    console.error("Upload error:", error);
    return null;
  }
}

/**
 * Extracts the storage path from a Supabase Storage URL
 *
 * This function takes a Supabase Storage URL and extracts the relative path
 * to the file within the specified bucket. This is useful for operations
 * that require the file path rather than the full public URL.
 *
 * @param url - The full public URL of the file in Supabase Storage
 * @param bucketName - The name of the storage bucket where the file is stored
 * @returns The relative path to the file within the bucket, or null if the URL is invalid
 */
function extractStoragePathFromUrl(
  url: string,
  bucketName: string
): string | null {
  const pattern = new RegExp(`/storage/v1/object/public/${bucketName}/(.*)$`);
  const match = url.match(pattern);
  return match ? match[1] : null;
}

/**
 * Removes an image from Supabase Storage
 *
 * This function takes a public URL of an image stored in Supabase Storage and deletes it.
 * It first extracts the storage path from the URL using the extractStoragePathFromUrl function,
 * then uses the Supabase client to remove the file from the 'products' bucket.
 *
 * @param url - The public URL of the image to be removed
 * @returns Promise<boolean> - Returns true if the image was successfully removed, false otherwise
 */
export async function removeImageFromStorage(url: string): Promise<boolean> {
  try {
    const filePath = extractStoragePathFromUrl(url, "products");
    if (!filePath) {
      toast.error("Invalid image URL");
      return false;
    }

    const { error } = await supabase.storage
      .from("products")
      .remove([filePath]);

    if (error) {
      toast.error("Failed to remove image from storage");
      console.error("Remove error:", error);
      return false;
    }

    return true;
  } catch (error) {
    toast.error("An unexpected error occurred during image removal");
    console.error("Remove error:", error);
    return false;
  }
}
