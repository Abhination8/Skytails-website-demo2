import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { useLogin, useSignup, useUser } from "@/hooks/use-auth";
import { insertUserSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

// Schemas
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  petName: z.string().optional(),
});

export default function Auth() {
  const [location] = useLocation();
  const params = new URLSearchParams(window.location.search);
  const initialMode = params.get("mode") === "signup" ? "signup" : "login";
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  
  const { data: user, isLoading: isUserLoading } = useUser();
  const [, setLocation] = useLocation();

  if (user && !isUserLoading) {
    setLocation("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen pt-20 pb-12 flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display font-bold text-3xl text-slate-900 mb-2">
            {mode === "login" ? "Welcome back" : "Join PetWealth"}
          </h1>
          <p className="text-slate-500">
            {mode === "login" 
              ? "Manage your pet's future fund." 
              : "Start investing in your furry friend's happiness."}
          </p>
        </div>

        <Card className="border-0 shadow-soft bg-white/80 backdrop-blur-sm">
          <CardContent className="pt-6">
            <AnimatePresence mode="wait">
              {mode === "login" ? (
                <LoginForm key="login" onSwitch={() => setMode("signup")} />
              ) : (
                <SignupForm key="signup" onSwitch={() => setMode("login")} />
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function LoginForm({ onSwitch }: { onSwitch: () => void }) {
  const login = useLogin();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <motion.form
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      onSubmit={form.handleSubmit((data) => login.mutate(data))}
      className="space-y-4"
    >
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input 
          id="email" 
          type="email" 
          placeholder="you@example.com" 
          {...form.register("email")}
          className="rounded-xl bg-slate-50 border-slate-200 focus:ring-primary/20"
        />
        {form.formState.errors.email && (
          <p className="text-xs text-red-500">{form.formState.errors.email.message}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input 
          id="password" 
          type="password"
          {...form.register("password")}
          className="rounded-xl bg-slate-50 border-slate-200 focus:ring-primary/20"
        />
        {form.formState.errors.password && (
          <p className="text-xs text-red-500">{form.formState.errors.password.message}</p>
        )}
      </div>

      <Button 
        type="submit" 
        className="w-full rounded-xl h-12 text-base shadow-lg shadow-primary/20"
        disabled={login.isPending}
      >
        {login.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
        Log In
      </Button>

      {login.error && (
        <p className="text-sm text-red-500 text-center bg-red-50 p-2 rounded-lg">
          {login.error.message}
        </p>
      )}

      <div className="text-center mt-4">
        <p className="text-sm text-slate-500">
          Don't have an account?{" "}
          <button 
            type="button" 
            onClick={onSwitch}
            className="font-medium text-primary hover:underline"
          >
            Sign up
          </button>
        </p>
      </div>
    </motion.form>
  );
}

function SignupForm({ onSwitch }: { onSwitch: () => void }) {
  const signup = useSignup();
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
  });

  return (
    <motion.form
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      onSubmit={form.handleSubmit((data) => signup.mutate(data))}
      className="space-y-4"
    >
      <div className="space-y-2">
        <Label htmlFor="name">Your Name</Label>
        <Input 
          id="name" 
          placeholder="John Doe"
          {...form.register("name")}
          className="rounded-xl bg-slate-50 border-slate-200 focus:ring-primary/20"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input 
          id="email" 
          type="email" 
          placeholder="you@example.com"
          {...form.register("email")}
          className="rounded-xl bg-slate-50 border-slate-200 focus:ring-primary/20"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input 
          id="password" 
          type="password"
          {...form.register("password")}
          className="rounded-xl bg-slate-50 border-slate-200 focus:ring-primary/20"
        />
      </div>

      <div className="pt-2 border-t border-slate-100 mt-2">
        <Label htmlFor="petName" className="text-primary font-medium">Pet's Name (Optional)</Label>
        <Input 
          id="petName" 
          placeholder="e.g. Buddy"
          {...form.register("petName")}
          className="rounded-xl bg-blue-50/50 border-blue-100 focus:ring-primary/20 mt-1"
        />
      </div>

      <Button 
        type="submit" 
        className="w-full rounded-xl h-12 text-base shadow-lg shadow-primary/20"
        disabled={signup.isPending}
      >
        {signup.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
        Create Account
      </Button>

      {signup.error && (
        <p className="text-sm text-red-500 text-center bg-red-50 p-2 rounded-lg">
          {signup.error.message}
        </p>
      )}

      <div className="text-center mt-4">
        <p className="text-sm text-slate-500">
          Already have an account?{" "}
          <button 
            type="button" 
            onClick={onSwitch}
            className="font-medium text-primary hover:underline"
          >
            Log in
          </button>
        </p>
      </div>
    </motion.form>
  );
}
