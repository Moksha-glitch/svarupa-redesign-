"use client";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex min-h-11 min-w-11 items-center justify-center gap-2 whitespace-nowrap rounded-xl text-[0.95rem] font-medium transition-[color,background-color,border-color,transform,opacity] duration-200 ease-out active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40",
  {
    variants: {
      variant: {
        primary:
          "bg-charcoal text-ivory hover:bg-ink",
        secondary:
          "border border-border bg-transparent text-charcoal hover:border-line-strong hover:bg-stone/40",
        ghost: "bg-transparent text-charcoal-soft hover:bg-stone/50 hover:text-ink",
        terracotta: "bg-terracotta text-ivory hover:bg-copper",
        quiet: "bg-stone/70 text-charcoal hover:bg-stone",
      },
      size: {
        sm: "h-9 min-h-9 px-3.5",
        md: "h-11 px-5",
        lg: "h-12 px-7 text-base",
        icon: "size-11",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}
