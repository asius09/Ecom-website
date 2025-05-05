import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { WishlistItem } from "@/types/wishlistItem";

const WISHLIST_TABLE = "wishlist_items";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const url = new URL(request.url);
    const userId = url.searchParams.get("user_id");
    const productId = url.searchParams.get("product_id");

    let query = supabase.from(WISHLIST_TABLE).select("*");

    if (userId) {
      query = query.eq("user_id", userId);
    }
    if (productId) {
      query = query.eq("product_id", productId);
    }

    const { data, error } = await query;

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

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { product_id, user_id }: Omit<WishlistItem, "id"> =
      await request.json();

    const { data, error } = await supabase
      .from(WISHLIST_TABLE)
      .insert([{ product_id, user_id }])
      .select()
      .single();

    if (error) {
      return NextResponse.json({
        data: null,
        error: error.message,
        status: 500,
        statusText: "failed",
      });
    }

    return NextResponse.json({
      data: data,
      error: null,
      status: 201,
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

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();

    const { id, user_id } = await request.json();

    const { data, error } = await supabase
      .from(WISHLIST_TABLE)
      .delete()
      .eq("id", id)
      .eq("user_id", user_id)
      .single();
    if (error) {
      return NextResponse.json({
        data: null,
        error: error.message,
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
