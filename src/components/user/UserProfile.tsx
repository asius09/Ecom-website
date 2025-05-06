"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Edit } from "lucide-react";
import { useState } from "react";
import { User as UserType } from "@/types/user";
import { useAppSelector } from "@/lib/hooks";

export function UserProfile() {
  const storeUser = useAppSelector((state) => state.user);
  const [user, setUser] = useState<UserType>({
    id: storeUser.id || "",
    name: storeUser.name || "",
    email: storeUser.email || "",
    is_admin: storeUser.is_admin || false,
    created_at:
      typeof storeUser.created_at === "string"
        ? storeUser.created_at
        : new Date().toISOString(),
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    //TODO
  };

  const handleSave = () => {
    setIsEditing(false);
    // TODO
  };

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-2xl mx-auto bg-card rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <User className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold">Profile Information</h1>
          </div>
          {!isEditing ? (
            <Button variant="outline" onClick={handleEditToggle}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          ) : (
            <Button onClick={handleSave}>Save Changes</Button>
          )}
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              value={user.name}
              onChange={handleChange}
              placeholder="John Doe"
              disabled={!isEditing}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-muted-foreground" />
              <Input
                id="email"
                name="email"
                value={user.email}
                onChange={handleChange}
                placeholder="john.doe@example.com"
                type="email"
                disabled={!isEditing}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
