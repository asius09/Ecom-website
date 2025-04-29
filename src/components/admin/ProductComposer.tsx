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

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  quantity: number;
  images: File[];
  inStock: boolean;
}

export function ProductComposer() {
  const [productName, setProductName] = useState<string>("");
  const [productDescription, setProductDescription] = useState<string>("");
  const [productPrice, setProductPrice] = useState<string>("");
  const [productQuantity, setProductQuantity] = useState<number>(0);
  const [productImages, setProductImages] = useState<File[]>([]);
  const [inStock, setInStock] = useState<boolean>(true);

  const dropzoneOptions: DropzoneOptions = {
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
    },
    onDrop: (acceptedFiles: File[]) => {
      setProductImages((prevImages) => [...prevImages, ...acceptedFiles]);
    },
  };

  const { getRootProps, getInputProps } = useDropzone(dropzoneOptions);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData: ProductFormData = {
      name: productName,
      description: productDescription,
      price: productPrice,
      quantity: productQuantity,
      images: productImages,
      inStock: inStock,
    };
    console.log("Submitting product:", formData);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Create Product</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Product</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
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
                  value={productPrice}
                  onChange={(e) => setProductPrice(e.target.value)}
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
                value={productQuantity}
                onChange={(e) => setProductQuantity(Number(e.target.value))}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="inStock">Stock Status</Label>
            <select
              id="inStock"
              value={inStock ? "true" : "false"}
              onChange={(e) => setInStock(e.target.value === "true")}
              className="block w-full p-2 border rounded-md bg-background"
            >
              <option value="true">In Stock</option>
              <option value="false">Out of Stock</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label>Product Images</Label>
            <div
              {...getRootProps()}
              className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-500 transition-colors"
            >
              <input {...getInputProps()} />
              <p>Drag & drop some images here, or click to select files</p>
            </div>
            {productImages.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-4">
                {productImages.map((file, index) => (
                  <img
                    key={index}
                    src={URL.createObjectURL(file)}
                    alt={`preview-${index}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                ))}
              </div>
            )}
          </div>

          <Button type="submit" className="w-full">
            Create Product
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
