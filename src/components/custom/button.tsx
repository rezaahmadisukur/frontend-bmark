import * as React from "react";
import { Button as ShadcnButton, buttonVariants } from "~/components/ui/button";
import { type VariantProps } from "class-variance-authority";
import { cn } from "~/lib/utils";

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

export function Button({ className, ...props }: ButtonProps) {
  return (
    <ShadcnButton
      className={cn(
        "shadow-[0_6px_0_#4338ca]",
        "hover:shadow-[0_4px_0_hsl(var(--primary))] hover:translate-y-0.5",
        "active:shadow-[0_1px_0_hsl(var(--primary))] active:translate-y-1.25",
        "transition-all duration-100",
        className
      )}
      {...props}
    />
  );
}
