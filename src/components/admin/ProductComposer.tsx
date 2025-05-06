"use client";

import { useState, useEffect, ReactNode, ChangeEvent, FormEvent } from "react";
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
import {
  removeImageFromStorage,
  uploadImage,
} from "@/utils/supabase/uploadImage";
import { toast } from "sonner";
import { createProduct, updateProduct } from "@/utils/product/admin";
import { useAppDispatch } from "@/lib/hooks";
import { Product } from "@/types/product";
import Image from "next/image";

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  quantity: number;
  images: File[];
  imageUrl?: string;
}

interface ProductComposerProps {
  product?: Product;
  buttonText?: ReactNode;
}

export function ProductComposer({
  product,
  buttonText = "Create Product",
}: ProductComposerProps) {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState<ProductFormData>({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price.toString() || "",
    quantity: product?.stock_quantity || 0,
    images: [],
    imageUrl: product?.image_url || "",
  });
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        quantity: product.stock_quantity,
        images: [],
        imageUrl: product.image_url,
      });
    }
  }, [product]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.price.trim() || isNaN(parseFloat(formData.price)))
      newErrors.price = "Valid price is required";
    if (formData.quantity <= 0)
      newErrors.quantity = "Quantity must be greater than 0";
    if (formData.images.length === 0 && !formData.imageUrl)
      newErrors.images = "At least one image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const dropzoneOptions: DropzoneOptions = {
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
    },
    onDrop: (acceptedFiles: File[]) => {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...acceptedFiles],
        imageUrl: "",
      }));
      setErrors((prev) => ({ ...prev, images: "" }));
    },
  };

  const { getRootProps, getInputProps } = useDropzone(dropzoneOptions);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: "" }));
  };

  const handleQuantityChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);

    if (isNaN(value) || value < 0) {
      setErrors((prev) => ({
        ...prev,
        quantity: "Quantity must be a positive integer",
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      quantity: value,
    }));

    if (value > 0) {
      setErrors((prev) => ({
        ...prev,
        quantity: "",
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        quantity: "Quantity must be greater than 0",
      }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill out all required fields correctly");
      return;
    }

    setIsUploading(true);
    let uploadedUrl: string = formData.imageUrl || "";
    const oldImageUrl = formData.imageUrl;

    try {
      if (formData.images.length > 0) {
        const url = await uploadImage(formData.images[0]);
        if (!url) {
          throw new Error("Failed to upload image");
        }
        uploadedUrl = url;

        if (oldImageUrl && oldImageUrl !== url) {
          await removeImageFromStorage(oldImageUrl);
        }
      }

      if (product) {
        await updateProduct(
          product.id,
          {
            name: formData.name,
            description: formData.description,
            price: parseFloat(formData.price),
            stock_quantity: formData.quantity,
            image_url: uploadedUrl,
            review: product.review,
            created_at: product.created_at,
          },
          dispatch
        );
      } else {
        await createProduct({
          product: {
            name: formData.name,
            description: formData.description,
            price: parseFloat(formData.price),
            stock_quantity: formData.quantity,
            image_url: uploadedUrl,
            review: 0,
          },
          dispatch,
        });
      }

      setIsOpen(false);
      setFormData({
        name: "",
        description: "",
        price: "",
        quantity: 0,
        images: [],
        imageUrl: "",
      });
      setErrors({});
      toast.success(
        product
          ? "Product updated successfully"
          : "Product created successfully"
      );
    } catch (error) {
      console.error("Error processing product request:", error);
      toast.error("An error occurred while processing your request");
      if (uploadedUrl && !product) {
        await removeImageFromStorage(uploadedUrl);
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">{buttonText}</Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[600px]"
        aria-describedby="dialog-description"
      >
        <DialogHeader>
          <DialogTitle>
            {product ? "Edit Product" : "Create New Product"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <section className="space-y-2">
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={handleChange}
              aria-invalid={!!errors.name}
              aria-describedby="name-error"
            />
            {errors.name && (
              <p id="name-error" className="text-sm text-red-500">
                {errors.name}
              </p>
            )}
          </section>

          <section className="space-y-2" aria-describedby="description-section">
            <Label htmlFor="description">Product Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={handleChange}
              aria-invalid={!!errors.description}
              aria-describedby={
                errors.description ? "description-error" : "description-section"
              }
              className="min-h-[120px] resize-y"
            />
            {errors.description && (
              <p id="description-error" className="text-sm text-red-600 mt-1">
                {errors.description}
              </p>
            )}
          </section>

          <section className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price *</Label>
              <div className="relative">
                <span className="absolute left极3 top-1/2 -translate-y-1/2 text-gray-500">
                  $
                </span>
                <Input
                  id="price"
                  type="text"
                  inputMode="decimal"
                  value={formData.price}
                  onChange={handleChange}
                  className="pl-7"
                  aria-invalid={!!errors.price}
                  aria-describedby="price-error"
                />
              </div>
              {errors.price && (
                <p id="price-error" className="text-sm text-red-500">
                  {errors.price}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                value={formData.quantity}
                onChange={handleQuantityChange}
                min="1"
                aria-invalid={!!errors.quantity}
                aria-describedby="quantity-error"
              />
              {errors.quantity && (
                <p id="quantity-error" className="text-sm text-red-500">
                  {errors.quantity}
                </p>
              )}
            </div>
          </section>

          <section className="space-y-2">
            <Label>Product Images *</Label>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-500 transition-colors ${
                errors.images ? "border-red-500" : ""
              }`}
              aria-invalid={!!errors.images}
              aria-describedby="images-error"
            >
              <input {...getInputProps()} />
              <p>Drag & drop some images here, or click to select files</p>
            </div>
            {errors.images && (
              <p id="images-error" className="text-sm text-red-500">
                {errors.images}
              </p>
            )}
            {formData.images.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-4">
                {formData.images.map((file, index) => (
                  <Image
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
