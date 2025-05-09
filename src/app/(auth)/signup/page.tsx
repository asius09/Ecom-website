"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    terms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
  });

  const validateForm = () => {
    const newErrors = {
      name: formData.name ? "" : "Name is required",
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
        ? ""
        : "Invalid email address",
      password:
        formData.password.length >= 8
          ? ""
          : "Password must be at least 8 characters",
    };
    setErrors(newErrors);

    if (!formData.terms) {
      toast.error("Terms and Conditions", {
        description: "You must accept the terms and conditions",
      });
      return false;
    }

    return !Object.values(newErrors).some((error) => error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const options = {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      };
      const response = await fetch("/api/auth/signup", options);
      const data = await response.json();
      if (data.status === 200) {
        toast.success("Sign up successful!", {
          description: "Please check your email to verify your account.",
        });
        router.push("/login");
      }
      throw new Error(data.error);
    } catch (error) {
      toast.error("Sign up failed", {
        description:
          error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
      setIsLoading(false);
      setFormData({
        name: "",
        email: "",
        password: "",
        terms: false,
      });
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm md:max-w-md mx-4 my-8">
        <CardHeader className="flex flex-col items-center">
          <CardTitle className="text-2xl text-center">Create Account</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <Label>Full Name</Label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter your full name"
                autoComplete="name"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>
            <div className="space-y-3">
              <Label>Email</Label>
              <Input
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="Enter your email"
                autoComplete="email"
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>
            <div className="space-y-3">
              <Label>Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="Enter your password"
                  autoComplete="new-password"
                  className={errors.password ? "border-red-500" : ""}
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
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>
            <div className="flex items-start space-x-3">
              <Checkbox
                id="terms"
                checked={formData.terms}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, terms: !!checked })
                }
                aria-label="Accept terms and conditions"
                className="cursor-pointer"
              />
              <div className="mt-0.5">
                <Label htmlFor="terms" className="text-sm leading-none">
                  I agree to the{" "}
                  <button
                    type="button"
                    className="text-primary hover:underline cursor-pointer p-0"
                    onClick={() => setTermsOpen(true)}
                    aria-label="View terms and conditions"
                  >
                    terms and conditions
                  </button>
                </Label>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full"
              aria-label="Sign up with provided credentials"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Sign Up"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-primary hover:underline"
              aria-label="Go to login page"
            >
              Log in
            </Link>
          </p>
        </CardFooter>
      </Card>

      {termsOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg p-6 max-w-md max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Terms and Conditions</h2>
            <div className="prose prose-sm">
              <p>Here are the detailed terms and conditions...</p>
            </div>
            <div className="mt-4 flex justify-end">
              <Button onClick={() => setTermsOpen(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
