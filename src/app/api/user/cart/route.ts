import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { CartItem } from "@/types/cartItem";

const CART_TABLE = "cart_items";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase.from(CART_TABLE).select("*");
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
    const { product_id, user_id, quantity }: Omit<CartItem, "id"> =
      await request.json();

    // Check if product already exists in cart for this user
    const { data: existed } = await supabase
      .from(CART_TABLE)
      .select()
      .eq("product_id", product_id)
      .eq("user_id", user_id)
      .single();
    if (existed) {
      // Update the quantity by incrementing the existing quantity
      const { data, error } = await supabase
        .from(CART_TABLE)
        .update({ quantity: existed.quantity + quantity })
        .eq("id", existed.id)
        .select()
        .single();

      return NextResponse.json({
        data: data,
        error: null,
        status: 200,
        statusText: "success",
      });
    }
    const { data, error } = await supabase
      .from(CART_TABLE)
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

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();

    const { id, user_id } = await request.json();

    const { data, error } = await supabase
      .from(CART_TABLE)
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
