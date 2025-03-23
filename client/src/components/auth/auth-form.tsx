import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/components/providers/auth-provider";
import { useToast } from "@/hooks/use-toast";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

type AuthMode = "login" | "register";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = loginSchema.extend({
  displayName: z.string().min(2, "Display name must be at least 2 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export function AuthForm() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [, navigate] = useLocation();
  const { login, register, isLoading } = useAuth();
  const { toast } = useToast();

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      displayName: "",
    },
  });

  const onLoginSubmit = async (data: LoginFormValues) => {
    try {
      await login(data.email, data.password);
      navigate("/");
    } catch (error) {
      // Error is handled in the useAuth hook
      console.error("Login error:", error);
    }
  };

  const onRegisterSubmit = async (data: RegisterFormValues) => {
    try {
      await register(data.email, data.password, data.displayName);
      navigate("/");
    } catch (error) {
      // Error is handled in the useAuth hook
      console.error("Register error:", error);
    }
  };

  // Reset forms when switching between modes
  const switchToLogin = () => {
    loginForm.reset();
    setMode("login");
  };

  const switchToRegister = () => {
    registerForm.reset();
    setMode("register");
  };

  return (
    <>
      {/* Auth Tabs */}
      <div className="flex border-b border-neutral-300 mb-6">
        <button
          className={`flex-1 text-center py-3 font-medium ${
            mode === "login"
              ? "text-primary border-b-2 border-primary"
              : "text-neutral-400"
          }`}
          onClick={switchToLogin}
          type="button"
        >
          Log In
        </button>
        <button
          className={`flex-1 text-center py-3 font-medium ${
            mode === "register"
              ? "text-primary border-b-2 border-primary"
              : "text-neutral-400"
          }`}
          onClick={switchToRegister}
          type="button"
        >
          Sign Up
        </button>
      </div>

      {mode === "login" ? (
        <Form {...loginForm}>
          <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4 mb-6">
            <FormField
              control={loginForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-neutral-500">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="your@email.com"
                      {...field}
                      className="px-4 py-3 rounded-lg border border-neutral-300 focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={loginForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between mb-1">
                    <FormLabel className="text-sm font-medium text-neutral-500">Password</FormLabel>
                    <Link href="/forgot-password" className="text-sm text-secondary hover:text-secondary/80 transition">
                      Forgot password?
                    </Link>
                  </div>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      {...field}
                      className="px-4 py-3 rounded-lg border border-neutral-300 focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 rounded-lg shadow-sm hover:shadow transition auth-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Log In"
              )}
            </Button>
          </form>
        </Form>
      ) : (
        <Form {...registerForm}>
          <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4 mb-6">
            <FormField
              control={registerForm.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-neutral-500">Display Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your name"
                      {...field}
                      className="px-4 py-3 rounded-lg border border-neutral-300 focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={registerForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-neutral-500">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      {...field}
                      className="px-4 py-3 rounded-lg border border-neutral-300 focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={registerForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-neutral-500">Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      {...field}
                      className="px-4 py-3 rounded-lg border border-neutral-300 focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 rounded-lg shadow-sm hover:shadow transition auth-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
        </Form>
      )}

      {/* Sign Up/Login Link */}
      <p className="mt-8 text-center text-neutral-400">
        {mode === "login" ? (
          <>
            <span>Don't have an account?</span>
            <button
              onClick={switchToRegister}
              type="button"
              className="text-secondary font-medium ml-1 hover:underline"
            >
              Sign up
            </button>
          </>
        ) : (
          <>
            <span>Already have an account?</span>
            <button
              onClick={switchToLogin}
              type="button"
              className="text-secondary font-medium ml-1 hover:underline"
            >
              Log in
            </button>
          </>
        )}
      </p>
    </>
  );
}
