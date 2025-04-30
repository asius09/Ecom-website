"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { login } from "../api/auth/action";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/hooks";
import { setUser } from "@/lib/store/slices/userSlice";
import { User } from "@/types/user";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      const {
        success,
        data: { user },
      } = await login(formData);
      if (success) {
        const userData: User = {
          id: user.id,
          email: user.email,
          name: user.user_metadata?.name || "",
          is_admin: user.user_metadata?.is_admin || false,
          created_at: user.created_at,
        };
        console.log("Login store Data", userData);
        dispatch(setUser(userData));
        toast.success("Login successful!");
        router.push("/");
      } else {
        throw new Error("Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed", {
        description:
          error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md my-8">
        <CardHeader className="flex flex-col items-center">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            MyShop
          </h1>
          <CardTitle className="text-2xl text-center" id="login-title">
            Log In
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={onSubmit}
            className="space-y-4"
            aria-labelledby="login-title"
          >
            <div>
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Email
              </label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                autoComplete="email"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full"
              aria-label="Log in with provided credentials"
              disabled={isLoading || !email || !password}
            >
              {isLoading ? "Logging in..." : "Log In"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="font-medium text-primary hover:underline"
              aria-label="Go to sign up page"
            >
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </main>
  );
}
