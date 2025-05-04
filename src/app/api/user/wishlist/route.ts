import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase.from("wishlist_items").select("*");
    if (error) {
      return NextResponse.json({
        data: null,
        error: error,
        status: 500,
        statusText: "failed",
      });
    }

    return NextResponse.json({
      data: data,
      error: null,
      status: 200,
      statusText: "success",
    });
  } catch (error) {
    return NextResponse.json({
      data: null,
      error: error,
      status: 500,
      statusText: "failed",
    });
  }
}
