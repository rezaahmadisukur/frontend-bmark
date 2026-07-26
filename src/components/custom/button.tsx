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
        "shadow-[0_5px_0_#3730a3]",
        "active:shadow-none active:translate-y-1.25",
        "transition-all duration-100",
        className
      )}
      {...props}
    />
  );
}
