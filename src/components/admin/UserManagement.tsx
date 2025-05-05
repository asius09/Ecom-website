"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2 } from "lucide-react";
import { User } from "@/types/user";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingRoles, setUpdatingRoles] = useState<Record<string, boolean>>(
    {}
  );

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await fetch("/api/admin/users");
        const result = await response.json();

        if (result.statusText === "failed") {
          throw new Error(result.error || "Failed to fetch users");
        }

        setUsers(result.data);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    getUsers();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin?resource=users&id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      toast.success("User deleted successfully");
      const updatedResponse = await fetch("/api/admin?resource=users");
      const { data: updatedUsers } = await updatedResponse.json();
      setUsers(updatedUsers);
    } catch (error) {
      toast.error("Failed to delete user");
      console.error("Error deleting user:", error);
    }
  };

  const handleRoleChange = async (
    userId: string,
    newRole: "Admin" | "User"
  ) => {
    try {
      setUpdatingRoles((prev) => ({ ...prev, [userId]: true }));

      const response = await fetch(`/api/admin?resource=users&id=${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_admin: newRole === "Admin" }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user role");
      }

      toast.success("User role updated successfully");
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, is_admin: newRole === "Admin" } : user
        )
      );
    } catch (error) {
      toast.error("Failed to update user role");
      console.error("Error updating user role:", error);
    } finally {
      setUpdatingRoles((prev) => ({ ...prev, [userId]: false }));
    }
  };

  const getRoleStyle = (isAdmin: boolean) => {
    return isAdmin
      ? "bg-indigo-100 dark:bg-indigo-900/20 text-indigo-800 dark:text-indigo-200"
      : "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-200";
  };

  return (
    <section className="space-y-4">
      <header>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
          User Management
        </h1>
      </header>
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 dark:bg-gray-800">
            <TableHead className="text-gray-700 dark:text-gray-300 font-semibold">
              Name
            </TableHead>
            <TableHead className="text-gray-700 dark:text-gray-300 font-semibold">
              Email
            </TableHead>
            <TableHead className="text-gray-700 dark:text-gray-300 font-semibold">
              Role
            </TableHead>
            <TableHead className="text-right text-gray-700 dark:text-gray-300 font-semibold">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow
              key={user.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
            >
              <TableCell className="font-medium text-gray-800 dark:text-gray-200">
                {user.name}
              </TableCell>
              <TableCell className="text-gray-600 dark:text-gray-400">
                {user.email}
              </TableCell>
              <TableCell>
                <Select
                  value={user.is_admin ? "Admin" : "User"}
                  onValueChange={(value: "Admin" | "User") =>
                    handleRoleChange(user.id, value)
                  }
                  disabled={updatingRoles[user.id]}
                >
                  <SelectTrigger
                    className={`w-[100px] ${getRoleStyle(user.is_admin)}`}
                  >
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-900">
                    <SelectItem
                      value="Admin"
                      className="text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
                    >
                      Admin
                    </SelectItem>
                    <SelectItem
                      value="User"
                      className="text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30"
                    >
                      User
                    </SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDelete(user.id)}
                  disabled={updatingRoles[user.id]}
                  aria-label={`Delete user ${user.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}
