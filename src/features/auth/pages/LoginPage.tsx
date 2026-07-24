"use client";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel
} from "~/components/ui/field";
import { type LoginFormData, loginSchema, useLogin } from "../api/login";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "~/components/ui/input";
import { Bookmark, Loader2 } from "lucide-react";
import { Activity } from "~/components/partials/Activity";
import Link from "next/link";
import { Button } from "~/components/custom/button";

const LoginPage = () => {
  const loginMutation = useLogin();
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate({ data });
  };

  return (
    <div className="space-y-6">
      {/* Logo & Title */}
      <div className="flex flex-col items-center gap-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-900/50">
          <Bookmark size={20} className="text-white" />
        </div>
        <h1 className="text-xl font-bold text-white">Welcome back</h1>
        <p className="text-sm text-zinc-500">Sign in to your B-Mark account</p>
      </div>

      {/* Form */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FieldGroup>
          {/* Email */}
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                <Input
                  type="email"
                  id={field.name}
                  placeholder="johndoe@example.com"
                  aria-invalid={fieldState.invalid}
                  {...field}
                />
                <Activity mode={fieldState.invalid ? "visible" : "hidden"}>
                  <FieldError errors={[fieldState.error]} />
                </Activity>
              </Field>
            )}
          />

          {/* Password */}
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                <Input
                  type="password"
                  id={field.name}
                  placeholder="********"
                  aria-invalid={fieldState.invalid}
                  {...field}
                />
                <Activity mode={fieldState.invalid ? "visible" : "hidden"}>
                  <FieldError errors={[fieldState.error]} />
                </Activity>
              </Field>
            )}
          />
          <Field>
            <Button
              type="submit"
              className="w-full bg-indigo-600 text-white hover:bg-indigo-500 cursor-pointer"
              disabled={loginMutation.isPending}
            >
              <Activity mode={loginMutation.isPending ? "visible" : "hidden"}>
                <Loader2 size={16} className="animate-spin" />
                Signing in...
              </Activity>
              <Activity mode={!loginMutation.isPending ? "visible" : "hidden"}>
                Sign In
              </Activity>
            </Button>
          </Field>
        </FieldGroup>
      </form>

      {/* Link to register */}
      <p className="text-center text-sm text-zinc-600">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-medium text-indigo-400 hover:text-indigo-300"
        >
          Create one
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
