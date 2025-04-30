import { toggleWishlist as toggleWishlistAPI } from "@/app/api/products/action";
import { toast } from "sonner";
import { useAppSelector } from "@/lib/hooks";

export const handleToggleWishlist = async (
  productId: string,
  userId?: string
) => {
  const { id: user_id } = useAppSelector((state) => state.user);
  const finalUserId = userId || user_id || "";

  try {
    const isWishlisted = await toggleWishlistAPI(productId, finalUserId);

    if (isWishlisted) {
      toast.success("Added to wishlist!");
      return true;
    } else {
      toast.success("Removed from wishlist!");
      return false;
    }
  } catch (error) {
    toast.error("Failed to update wishlist");
    return false;
  }
};
