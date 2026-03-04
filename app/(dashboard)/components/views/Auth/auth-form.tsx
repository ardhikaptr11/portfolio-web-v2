"use client";

import { FormInput } from "../../forms/form-input";
import { FormInputPassword } from "../../forms/form-input-password";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Link2Off } from "lucide-react";
import Link from "next/link";
import { loginAsAdmin, loginAsGuest } from "@/app/(dashboard)/auth/actions";
import { environments } from "@/app/environments";

const FormSchema = z.object({
  email: z.email("Email is not valid").nonempty("Email is required"),
  password: z
    .string()
    .min(8, "Password must contains at least 8 characters")
    .regex(
      /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/,
      "Password doesn't meet the security requirement",
    ),
});

export type AuthFormValue = z.infer<typeof FormSchema>;

const forbiddenNames = ["john", "john doe", "jane", "jane doe", "doe"];

const GuestFormSchema = z.object({
  name: z
    .string()
    .trim()
    .nonempty("Name is required")
    .refine((val) => !forbiddenNames.includes(val.toLowerCase()), {
      message: "Name is not allowed",
    }),
  email: z.email("Email is not valid").nonempty("Email is required"),
});

export type GuestAuthFormValue = z.infer<typeof GuestFormSchema>;

const AuthForm = () => {
  const [loading, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const form = useForm<AuthFormValue>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: AuthFormValue) => {
    startTransition(async () => {
      toast.promise(loginAsAdmin(data), {
        loading: "Logging you in...",
        success: () => {
          return {
            duration: 1500,
            onAutoClose: () => router.replace("/dashboard"),
            message: "Welcome to dashboard!",
          };
        },
        error: (error: Error) => {
          return {
            message: "Error while logging you in",
            description: error.message,
          };
        },
      });
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-sm p-6">
        <CardHeader className="flex flex-col items-center px-0 text-center">
          <h2 className="font-semibold text-blue-950 dark:text-white">
            Login to Dashboard
          </h2>
          <p className="text-muted-foreground text-sm">
            Provide your secure credentials to gain access
          </p>
        </CardHeader>
        <CardContent className="px-0">
          <Form
            form={form}
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormInput
              control={form.control}
              name="email"
              label="Email"
              disabled={loading}
              autoComplete="email"
              required
            />
            <FormInputPassword
              control={form.control}
              type={showPassword ? "text" : "password"}
              name="password"
              label="Password"
              disabled={loading}
              showPassword={showPassword}
              setShowPassword={() => setShowPassword((prev) => !prev)}
              required
            />

            <div className="ml-auto flex items-center gap-1 text-xs">
              <p className="text-muted-foreground">Come as a guest?</p>
              <Button variant="link" asChild className="p-0 text-xs">
                <Link href="/auth?role=guest">Login here</Link>
              </Button>
            </div>

            <Button
              disabled={loading}
              className={cn("mt-2 ml-auto w-full", {
                "flex gap-1": loading,
              })}
              type="submit"
            >
              {loading && <Spinner variant="circle" />}
              <span>{loading ? "Authenticating" : "Login"}</span>
            </Button>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

const GuestAuthForm = () => {
  const [loading, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<GuestAuthFormValue>({
    resolver: zodResolver(GuestFormSchema),
    defaultValues: {
      name: "",
      email: environments.GUEST_EMAIL,
    },
  });

  const onSubmit = (data: GuestAuthFormValue) => {
    startTransition(async () => {
      toast.promise(loginAsGuest(data), {
        loading: "Logging you in...",
        success: () => {
          return {
            duration: 1500,
            onAutoClose: () => router.replace("/dashboard"),
            message: "Welcome to dashboard!",
          };
        },
        error: (error: Error) => {
          return {
            message: "Error while logging you in",
            description: error.message,
          };
        },
      });
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-sm p-6">
        <CardHeader className="flex flex-col items-center px-0 text-center">
          <h2 className="font-semibold text-blue-950 dark:text-white">
            Login to Dashboard
          </h2>
          <p className="text-muted-foreground text-sm">
            Provide your information to gain access
          </p>
        </CardHeader>
        <CardContent className="px-0">
          <Form
            form={form}
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormInput
              control={form.control}
              name="name"
              label="Name"
              disabled={loading}
              autoComplete="off"
              required
            />
            <FormInput
              control={form.control}
              name="email"
              label="Email"
              autoComplete="email"
              required
              disabled
            />
            <Button
              disabled={loading}
              className={cn("mt-2 ml-auto w-full", {
                "flex gap-1": loading,
              })}
              type="submit"
            >
              {loading && <Spinner variant="circle" />}
              <span>{loading ? "Authenticating" : "Login"}</span>
            </Button>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export { AuthForm, GuestAuthForm };
