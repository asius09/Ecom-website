import { toggleWishlist as toggleWishlistAPI } from "@/app/api/products/users/wishlist/action";
import { toast } from "sonner";

export const handleToggleWishlist = async (
  productId: string,
  userId: string
) => {
  try {
    const isWishlisted = await toggleWishlistAPI(productId, userId);

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
