"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useDropzone, type DropzoneOptions } from "react-dropzone";
import { createProduct } from "@/app/api/products/admin/action";
import { Product } from "@/types/product";
import { uploadImage } from "@/utils/supabase/uploadImage";
import { toast } from "sonner";

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  quantity: number;
  images: File[];
}

export function ProductComposer() {
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    price: "",
    quantity: 0,
    images: [],
  });
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const dropzoneOptions: DropzoneOptions = {
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
    },
    onDrop: (acceptedFiles: File[]) => {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...acceptedFiles],
      }));
    },
  };

  const { getRootProps, getInputProps } = useDropzone(dropzoneOptions);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, quantity: Number(e.target.value) }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      let imageUrl = "";
      if (formData.images.length > 0) {
        const uploadedUrl = await uploadImage(formData.images[0]);
        if (!uploadedUrl) {
          throw new Error("Failed to upload image");
        }
        imageUrl = uploadedUrl;
      }

      const product: Omit<Product, "id" | "createdAt" | "updatedAt"> = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        stock_quantity: formData.quantity,
        review: 0,
        image_url: imageUrl,
      };

      await createProduct(product);
      toast.success("Product created successfully");
      setIsOpen(false);
      setFormData({
        name: "",
        description: "",
        price: "",
        quantity: 0,
        images: [],
      });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create product"
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Create Product</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Product</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <section className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </section>

          <section className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </section>

          <section className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  $
                </span>
                <Input
                  id="price"
                  type="text"
                  inputMode="decimal"
                  value={formData.price}
                  onChange={handleChange}
                  className="pl-7"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                value={formData.quantity}
                onChange={handleQuantityChange}
                required
              />
            </div>
          </section>

          <section className="space-y-2">
            <Label>Product Images</Label>
            <div
              {...getRootProps()}
              className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-500 transition-colors"
            >
              <input {...getInputProps()} />
              <p>Drag & drop some images here, or click to select files</p>
            </div>
            {formData.images.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-4">
                {formData.images.map((file, index) => (
                  <img
                    key={index}
                    src={URL.createObjectURL(file)}
                    alt={`preview-${index}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                ))}
              </div>
            )}
          </section>

          <Button type="submit" className="w-full" disabled={isUploading}>
            {isUploading ? "Creating..." : "Create Product"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
