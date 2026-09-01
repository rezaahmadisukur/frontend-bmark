"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

import { cn } from "~/lib/utils";
import { Button, buttonVariants } from "~/components/ui/button";

type PaginationLinkProps = React.ComponentProps<"button"> & {
  isActive?: boolean;
};

const Pagination = ({
  className,
  ...props
}: React.ComponentProps<"nav">) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
);

const PaginationContent = ({
  className,
  ...props
}: React.ComponentProps<"ul">) => (
  <ul
    className={cn("flex flex-row items-center gap-1", className)}
    {...props}
  />
);

const PaginationItem = ({
  className,
  ...props
}: React.ComponentProps<"li">) => (
  <li className={cn("", className)} {...props} />
);

const PaginationLink = ({
  className,
  isActive,
  ...props
}: PaginationLinkProps) => (
  <Button
    aria-current={isActive ? "page" : undefined}
    variant={isActive ? "outline" : "ghost"}
    size="icon"
    className={cn("cursor-pointer", className)}
    {...props}
  />
);

const PaginationPrevious = ({
  className,
  ...props
}: PaginationLinkProps) => (
  <PaginationLink
    aria-label="Previous page"
    className={cn("w-auto gap-1 px-2.5 sm:pl-2.5", className)}
    {...props}
  >
    <ChevronLeft size={14} />
    <span>Previous</span>
  </PaginationLink>
);

const PaginationNext = ({ className, ...props }: PaginationLinkProps) => (
  <PaginationLink
    aria-label="Next page"
    className={cn("w-auto gap-1 px-2.5 sm:pr-2.5", className)}
    {...props}
  >
    <span>Next</span>
    <ChevronRight size={14} />
  </PaginationLink>
);

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    aria-hidden
    className={cn(
      "flex h-9 w-9 items-center justify-center text-muted-foreground",
      className
    )}
    {...props}
  >
    <MoreHorizontal size={14} />
  </span>
);

export {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis
};
