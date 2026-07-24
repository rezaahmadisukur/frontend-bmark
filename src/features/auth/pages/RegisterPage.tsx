"use client";

import { Controller, useForm } from "react-hook-form";
import { RegisterFormData, registerSchema, useRegister } from "../api/register";
import { zodResolver } from "@hookform/resolvers/zod";
import { Bookmark, Loader2 } from "lucide-react";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Activity } from "~/components/partials/Activity";
import { Button } from "~/components/ui/button";
import Link from "next/link";

const RegisterPage = () => {
  const registerMutation = useRegister();
  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = (data: RegisterFormData) => {
    registerMutation.mutate({ data });
  };
  return (
    <div className="space-y-6">
      {/* Logo & Title */}
      <div className="flex flex-col items-center gap-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-900/50">
          <Bookmark size={20} className="text-white" />
        </div>
        <h1 className="text-xl font-bold text-white">Create Account</h1>
        <p className="text-sm text-zinc-500">Start your B-Mark journey</p>
      </div>

      {/* Form */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FieldGroup>
          {/* Name */}
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                <Input
                  type="text"
                  id={field.name}
                  placeholder="John Doe"
                  aria-invalid={fieldState.invalid}
                  {...field}
                />
                <Activity mode={fieldState.invalid ? "visible" : "hidden"}>
                  <FieldError errors={[fieldState.error]} />
                </Activity>
              </Field>
            )}
          />

          {/* Email */}
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="email">Email</FieldLabel>
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
                <FieldLabel htmlFor="password">Password</FieldLabel>
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
              disabled={registerMutation.isPending}
            >
              <Activity
                mode={registerMutation.isPending ? "visible" : "hidden"}
              >
                <Loader2 size={16} className="animate-spin" />
                Creating account...
              </Activity>
              <Activity
                mode={!registerMutation.isPending ? "visible" : "hidden"}
              >
                Create account
              </Activity>
            </Button>
          </Field>
        </FieldGroup>
      </form>

      {/* Link to login */}
      <p className="text-center text-sm text-zinc-600">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-indigo-400 hover:text-indigo-300"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;
