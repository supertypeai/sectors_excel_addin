import * as React from "react";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const cardvariants = cva(
  "p-3 rounded-lg border border-orange-200 bg-orange-100",
  {
    variants: {
      variant: {
        default: "",
        elevated: "bg-stone-100/70",
        rose: "border-l-2 border-l-spectral1 bg-background/80",
        link: "cursor-pointer bg-white border border-stone-200 hover:border-stone-400/30 hover:shadow-md transition-all",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export const CardHoverEffect =
  "rounded-lg transition-shadow duration-200 cursor-pointer hover:ring-1 hover:ring-border hover:shadow-md hover:shadow-orange-200/60";

const Card = React.forwardRef<
  HTMLDivElement,
  {
    variant?: VariantProps<typeof cardvariants>["variant"];
    className?: string;
    externalUrl?: string;
    onHoverEffect?: boolean;
  } & React.HTMLAttributes<HTMLDivElement>
>(
  (
    { className, variant, externalUrl, onHoverEffect, children, ...props },
    ref,
  ) => {
    const cardClasses = cn(
      cardvariants({ className, variant }),
      onHoverEffect && CardHoverEffect,
    );

    if (externalUrl) {
      return (
        <a
          href={externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cardClasses}
        >
          {children}
        </a>
      );
    }

    return (
      <div ref={ref} className={cardClasses} {...props}>
        {children}
      </div>
    );
  },
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-4", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-stone-500", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-4 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-4 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
