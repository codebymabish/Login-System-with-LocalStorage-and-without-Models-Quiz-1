import { toast } from "sonner";
import { z } from "zod";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { GraduationCap, Sparkles } from "lucide-react";
import React from "react";

// -------------------- VALIDATION SCHEMAS --------------------
const signupSchema = z.object({
  fullName: z.string()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name cannot exceed 50 characters"),
  email: z.string()
    .email("Please enter a valid email address")
    .min(1, "Email is required"),
  password: z.string()
    .min(6, "Password must be at least 6 characters")
    .max(50, "Password cannot exceed 50 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  role: z.enum(["student", "teacher"], {
    errorMap: () => ({ message: "Please select a valid role" })
  })
});

const loginSchema = z.object({
  email: z.string()
    .email("Please enter a valid email address")
    .min(1, "Email is required"),
  password: z.string()
    .min(1, "Password is required")
});

// -------------------- MAIN COMPONENT --------------------
export default function Auth() {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "student" as "student" | "teacher",
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const navigate = useNavigate();

  // -------------------- EFFECTS --------------------
  // Clear all input fields on page load
  useEffect(() => {
    setFormData({
      fullName: "",
      email: "",
      password: "",
      role: "student",
    });
  }, []);

  // Clear input fields when switching between tabs
  useEffect(() => {
    setFormData({
      fullName: "",
      email: "",
      password: "",
      role: "student",
    });
  }, [activeTab]);

  // -------------------- SIGNUP HANDLER --------------------
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      signupSchema.parse(formData);
      const response = await axios.post("http://localhost:5000/api/auth/signup", formData);

      toast.success("Registration successful! Please login.", {
        duration: 3000,
        position: "top-right",
      });

      // Clear fields after successful signup
      setFormData({
        fullName: "",
        email: "",
        password: "",
        role: "student",
      });

      setActiveTab("login");
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        err.errors.forEach((error) => {
          toast.error(error.message, {
            duration: 4000,
            position: "top-right",
          });
        });
      } else {
        toast.error(err.response?.data?.message || "Registration failed", {
          duration: 3000,
          position: "top-right",
        });
      }
    }
  };

  // -------------------- LOGIN HANDLER --------------------
 // -------------------- LOGIN HANDLER --------------------
const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setErrors({});
  setIsSubmitting(true);

  // Remove any stale auth info
  localStorage.removeItem("token");
  localStorage.removeItem("userRole");
  localStorage.removeItem("userId");
  localStorage.removeItem("user");

  try {
    loginSchema.parse({ email: formData.email, password: formData.password });

    const response = await axios.post("http://localhost:5000/api/auth/login", {
      email: formData.email,
      password: formData.password,
    });

    const { token, user } = response.data;

    if (!token || !user) {
      toast.error("Invalid login response from server", { duration: 3000 });
      setIsSubmitting(false);
      return;
    }

    // Store everything in localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("userRole", user.role);
    localStorage.setItem("userId", user.id);
    localStorage.setItem("user", JSON.stringify(user)); // ✅ store full user object

    const redirectPath = user.role === "teacher" ? "/teacher-dashboard" : "/student-dashboard";
    navigate(redirectPath, { replace: true });

  } catch (err: any) {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
    localStorage.removeItem("user");

    if (err instanceof z.ZodError) {
      err.errors.forEach(error => toast.error(error.message, { duration: 4000 }));
      setIsSubmitting(false);
      return;
    }

    const backendMsg = err.response?.data?.message;

    if (backendMsg === "User not found" || backendMsg?.toLowerCase()?.includes("not found")) {
      toast.error("User does not exist. Please sign up!", { duration: 3000 });
      setActiveTab("signup");
      setIsSubmitting(false);
      return;
    }

    toast.error(backendMsg || "Login failed", { duration: 3000 });
    setIsSubmitting(false);
  }
};

  // -------------------- UI RENDER --------------------
  return (
    <div className="mt-10 min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 px-4 py-12">
      <Card className="w-full max-w-md shadow-elevated hover:shadow-glow">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="relative">
              <GraduationCap className="h-12 w-12 text-primary" />
              <Sparkles className="h-5 w-5 text-accent absolute -top-1 -right-1 animate-pulse" />
            </div>
          </div>
          <div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
              QuizQuest
            </CardTitle>
            <CardDescription className="mt-2">
              AI-Powered Learning Platform
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as "login" | "signup")}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            {/* -------------------- LOGIN FORM -------------------- */}
            <TabsContent value="login">
              <form
                onSubmit={handleLogin}
                className="space-y-4 mt-4"
                autoComplete="off"
              >
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    name="login-email"
                    type="email"
                    autoComplete="new-email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    name="login-password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </form>
            </TabsContent>

            {/* -------------------- SIGNUP FORM -------------------- */}
            <TabsContent value="signup">
              <form
                onSubmit={handleSignup}
                className="space-y-4 mt-4"
                autoComplete="off"
              >
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input
                    id="signup-name"
                    name="signup-name"
                    type="text"
                    autoComplete="new-name"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    name="signup-email"
                    type="email"
                    autoComplete="new-email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    name="signup-password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-role">I am a...</Label>
                  <select
                    id="signup-role"
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        role: e.target.value as "teacher" | "student",
                      })
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                  </select>
                </div>
                <Button type="submit" className="w-full" variant="gradient">
                  Create Account
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
