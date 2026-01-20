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

const FormSchema = z.object({
  email: z.email("Email is not valid"),
  password: z
    .string()
    .min(8, "Password must contains at least 8 characters")
    .regex(
      /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/,
      "Password doesn't meet the security requirement",
    ),
});

type AuthFormValue = z.infer<typeof FormSchema>;

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

  const signInWithEmail = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error)
      return { isError: true, errorMessage: "Invalid login credentials" };

    return { isError: false, errorMessage: null };
  };

  const onSubmit = (data: AuthFormValue) => {
    startTransition(async () => {
      const { isError, errorMessage } = await signInWithEmail(data);

      if (isError) {
        toast.error("Login failed", {
          description: errorMessage,
        });
      } else {
        toast.success("Welcome to dashboard !");
        router.push("/dashboard");
      }
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-sm border-gray-300 p-6">
        <CardHeader className="flex flex-col items-center text-center">
          <h2 className="font-semibold text-blue-950 dark:text-white">
            Login to Dashboard
          </h2>
          <p className="text-sm text-muted-foreground">
            Welcome back! Enter credentials to continue.
          </p>
        </CardHeader>
        <CardContent>
          <Form
            form={form}
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormInput
              className="text-blue-950 dark:text-white"
              control={form.control}
              name="email"
              label="Email"
              disabled={loading}
              autoComplete="email"
              required
            />
            <FormInputPassword
              className="text-blue-950 dark:text-white"
              control={form.control}
              type={showPassword ? "text" : "password"}
              name="password"
              label="Password"
              disabled={loading}
              showPassword={showPassword}
              setShowPassword={() => setShowPassword((prev) => !prev)}
              required
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

export default AuthForm;
