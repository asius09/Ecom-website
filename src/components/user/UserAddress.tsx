"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin } from "lucide-react";
import { useState } from "react";

export function UserAddress() {
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "United States",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle address submission
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-card rounded-lg shadow-sm">
      <div className="flex items-center gap-3 mb-8">
        <MapPin className="w-8 h-8 text-primary" />
        <h1 className="text-2xl font-bold">Shipping Address</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="street">Street Address</Label>
            <Input
              id="street"
              name="street"
              value={address.street}
              onChange={handleChange}
              placeholder="123 Main St"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              name="city"
              value={address.city}
              onChange={handleChange}
              placeholder="New York"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">State/Province</Label>
            <Input
              id="state"
              name="state"
              value={address.state}
              onChange={handleChange}
              placeholder="NY"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="postalCode">Postal Code</Label>
            <Input
              id="postalCode"
              name="postalCode"
              value={address.postalCode}
              onChange={handleChange}
              placeholder="10001"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              name="country"
              value={address.country}
              onChange={handleChange}
              disabled
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" className="w-full md:w-auto">
            Save Address
          </Button>
        </div>
      </form>
    </div>
  );
}
