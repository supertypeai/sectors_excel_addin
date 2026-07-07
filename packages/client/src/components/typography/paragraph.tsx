import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Button, type buttonVariants } from "../ui/button";

import { cn } from "../../lib/utils";
import { type VariantProps, cva } from "class-variance-authority";
import { Icons } from "../commons/Icons";

export function TypographyList({
  as,
  children,
  className,
}: {
  as?: "ul" | "ol";
  className?: string;
  children: React.ReactNode;
}) {
  const baseClass =
    "my-4 ml-6 [&>li]:mt-1.5 tracking-tight leading-tight text-stone-800 dark:text-stone-400";

  if (as === "ol") {
    return (
      <ol className={cn(baseClass, "list-decimal", className)}>{children}</ol>
    );
  }

  return <ul className={cn(baseClass, "list-disc", className)}>{children}</ul>;
}

export function TypographyOrdered({
  items,
}: {
  items: Array<{ content: React.ReactNode }>;
}) {
  return (
    <ol className="my-4">
      {items.map((list, index) => (
        <li key={index} className="flex mb-3 gap-8 items-center">
          <div className="bg-sidebar dark:bg-spectral11 rounded-md p-3 text-foreground">
            {index + 1}
          </div>
          <div>{list.content}</div>
        </li>
      ))}
    </ol>
  );
}

export function TypographyInlineCode({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <code className="relative rounded-sm bg-muted px-[0.3rem] py-[0.2rem] font-mono font-semibold text-xs">
      {children}
    </code>
  );
}

export function TypographyKeycap({ children }: { children: React.ReactNode }) {
  return (
    <code className="relative rounded-sm bg-muted px-[0.2rem]  font-mono font-semibold shadow-sm shadow-stone-400">
      {children}
    </code>
  );
}

export const LINK_CLASS =
  "link-fancy text-foreground/90 w-fit inline-flex items-center text-left group";

export function TypographyLink({
  children,
  href,
  className,
  addArrow,
  ...props
}: {
  children: React.ReactNode;
  href: string;
  className?: string;
  addArrow?: boolean;
  [key: string]: any;
}) {
  if (props["aria-disabled"]) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <span className="cursor-not-allowed text-stone-500 font-medium">
              {children}
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <span className="text-xs font-medium">Under construction</span>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <a
      href={href}
      className={cn(LINK_CLASS, className)}
      {...props}
    >
      {children}{" "}
      {addArrow && (
        <Icons.Link
          className={cn(
            "inline -mt-0.5 ml-1 text-muted-foreground group-hover:animate-pulse group-hover:text-spectral1 dark:group-hover:text-spectral4",
            className?.includes("text-xs") ? "h-2.5 w-2.5" : "h-3.5 w-3.5",
          )}
        />
      )}
    </a>
  );
}

export function TypographyExternal({
  children,
  href,
  className,
}: {
  children: React.ReactNode;
  href: string;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(LINK_CLASS, className)}
    >
      {children}
      <Icons.ArrowUpRight className="h-3.5 w-3.5 inline" />
    </a>
  );
}

export function TypographyModalLink({
  children,
  className,
  addIcon = false,
  onClick,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  variant?: VariantProps<typeof buttonVariants>["variant"];
  addIcon?: boolean;
  onClick: () => void;
  [key: string]: any;
}) {
  return (
    <button onClick={onClick} {...props} className={cn(LINK_CLASS, className)}>
      {children}{" "}
      {addIcon && <Icons.PackageCheck className="inline ml-1 w-4 h-4" />}
    </button>
  );
}

export function TypographyButtonLink({
  children,
  href,
  className,
  variant = "rose",
  disabled = false,
  addArrow = false,
  ...props
}: {
  children: React.ReactNode;
  href?: string;
  className?: string;
  variant?: VariantProps<typeof buttonVariants>["variant"];
  disabled?: boolean;
  addArrow?: boolean;
  [key: string]: any;
}) {
  const linkVariants = cva("border-none link-button font-semibold", {
    variants: {
      variant: {
        default: "",
        destructive: "",
        outline: "",
        secondary: "hover:text-rose-500",
        ghost: "",
        link: "",
        rose: "",
        social: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  });

  if (href === undefined) {
    return (
      <Button variant={variant} disabled={disabled}>
        <span
          className={cn(linkVariants({ variant, className }), {
            "cursor-not-allowed": disabled,
          })}
          {...props}
        >
          {children}
        </span>
      </Button>
    );
  }

  return (
    <a href={href} {...props}>
      <Button variant={variant} disabled={disabled}>
        {children} {addArrow && <Icons.ArrowRight className="inline" />}
      </Button>
    </a>
  );
}

export function TypographyP({
  className,
  children,
  asChild,
}: {
  className?: string;
  children: React.ReactNode;
  asChild?: boolean;
}) {
  const componentClass =
    "text-stone-800 dark:text-stone-400 tracking-tight leading-tight";

  if (asChild)
    return <div className={cn(componentClass, className)}>{children}</div>;

  return <p className={cn(componentClass, className)}>{children}</p>;
}

export function TypographyQuote({
  children,
  hideQuotemark,
}: {
  children: React.ReactNode;
  hideQuotemark?: boolean;
}) {
  return (
    <blockquote className="text-xl italic font-medium text-stone-600 dark:text-stone-500 my-4">
      {!hideQuotemark && (
        <svg
          className="w-8 h-8 text-stone-400 dark:text-stone-600 mb-4"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 18 14"
        >
          <path d="M6 0H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3H2a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3h-1a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Z" />
        </svg>
      )}
      <TypographyP className="md:text-lg text-stone-600">
        {children}
      </TypographyP>
    </blockquote>
  );
}
