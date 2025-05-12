"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";

interface AuthFormProps {
  defaultTab?: "login" | "signup";
}

export function AuthForm({ defaultTab = "login" }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <div className="w-full max-w-[400px] mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome to Spotto</h1>
        <p className="text-muted-foreground">Sign in or create an account</p>
      </div>

      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-full mb-8">
          <TabsTrigger value="login">Log In</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>

        <TabsContent value="login">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="email">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="password">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <label
                  htmlFor="remember"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Remember me
                </label>
              </div>
              <Button variant="link" className="px-0">
                Forgot password?
              </Button>
            </div>

            <Button type="submit" className="w-full">
              Log In
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="signup">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="signup-email">
                Email
              </label>
              <Input
                id="signup-email"
                type="email"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="signup-password">
                Password
              </label>
              <Input
                id="signup-password"
                type="password"
                placeholder="••••••••"
                required
              />
            </div>

            <Button type="submit" className="w-full">
              Sign Up
            </Button>
          </form>
        </TabsContent>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-background px-2 text-muted-foreground">OR</span>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <Button variant="outline" className="w-full" type="button">
              <FcGoogle className="mr-2 h-4 w-4" />
              Continue with Google
            </Button>
            <Button variant="outline" className="w-full" type="button">
              <FaApple className="mr-2 h-4 w-4" />
              Continue with Apple
            </Button>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {defaultTab === "login" ? (
            <>
              Don't have an account?{" "}
              <Button variant="link" className="px-0">
                Sign up
              </Button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Button variant="link" className="px-0">
                Log in
              </Button>
            </>
          )}
        </p>
      </Tabs>
    </div>
  );
} 