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
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const validateForm = () => {
    const newErrors = {
      email:
        email.trim() === ""
          ? "Please enter your email"
          : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
            ? ""
            : "Invalid email address",
      password:
        password.trim() === ""
          ? "Please enter your password"
          : password.length >= 8
            ? ""
            : "Password must be at least 8 characters",
    };
    setErrors(newErrors);

    if (newErrors.password || newErrors.email) {
      return false;
    }

    return true;
  };

  // Using Route to Post Method to our own api
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email, password: password }),
      });
      const data = await response.json();
      if (data.status === 200) {
        toast.success("Login successful!");
        const redirectPath = data?.data.user_metadata.is_admin ? "/admin" : "/";
        console.log("Redirect Path is : ", redirectPath);
        router.push(redirectPath);
        router.refresh();
        return;
      }
      throw new Error(data.error);
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
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20 p-4">
      <Card className="w-full max-w-md shadow-lg rounded-xl border border-muted/20">
        <CardHeader className="flex flex-col items-center space-y-4">
          <CardTitle
            className="text-3xl font-bold text-center"
            id="login-title"
          >
            Welcome Back
          </CardTitle>
          <p className="text-muted-foreground text-center">
            Log in to your account
          </p>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={onSubmit}
            className="space-y-6"
            aria-labelledby="login-title"
          >
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                autoComplete="email"
                required
                className={
                  errors.email ? "border-red-500" : "hover:border-primary/50"
                }
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  className={
                    errors.password
                      ? "border-red-500"
                      : "hover:border-primary/50"
                  }
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-muted/50 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">{errors.password}</p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full h-11 text-base font-semibold transition-all hover:bg-primary/90 cursor-pointer"
              aria-label="Log in with provided credentials"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                  Logging in...
                </div>
              ) : (
                "Log In"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            <span>Don&apos;t have an account?</span>
            <Link
              href="/signup"
              className="font-medium text-primary hover:underline hover:text-primary/90"
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
