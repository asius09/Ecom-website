import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();

    //fetching Products
    const { data, error } = await supabase.from("products").select("*");

    if (error) {
      return NextResponse.json({
        data: null,
        error: `Failed!: ${error.message ?? error}`,
        status: 500,
        statusText: "failed",
      });
    }

    console.log("Fetch Data: ", data);

    return NextResponse.json({
      data: data,
      error: null,
      status: 200,
      statusText: "success",
    });
  } catch (error) {
    return NextResponse.json({
      data: null,
      error: `Failed!: ${error}`,
      status: 500,
      statusText: "failed",
    });
  }
}
