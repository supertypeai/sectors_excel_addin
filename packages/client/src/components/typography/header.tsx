import { cn } from "../../lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

export function TypographyH1({
  className,
  children,
  ...props
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <h1
      className={cn(
        "scroll-m-20 text-2xl md:text-3xl font-extrabold tracking-tight leading-tight",
        className
      )}
      {...props}
    >
      {children}
    </h1>
  );
}

const h2variants = cva(
  "scroll-m-20 text-lg lg:text-2xl font-bold tracking-tight first:mt-0 mb-4 w-fit",
  {
    variants: {
      variant: {
        default: "border-b pb-2",
        unbordered: "",
        larger: "text-2xl lg:text-3xl leading-tight",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export function TypographyH2({
  id,
  className,
  variant,
  children,
  ...props
}: {
  id?: string;
  className?: string;
  variant?: VariantProps<typeof h2variants>["variant"];
  children: React.ReactNode;
}) {
  return (
    <h2 id={id} className={cn(h2variants({ variant, className }))} {...props}>
      {children}
    </h2>
  );
}

export function TypographyH3({
  id,
  className,
  children,
  ...props
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <h3
      id={id}
      className={cn(
        "scroll-m-20 text-spectral1 dark:text-spectral2 text-lg font-semibold tracking-tight leading-tight",
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

export function TypographyH4({
  className,
  children,
  ...props
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <h4
      className={cn(
        "scroll-m-20 font-medium tracking-tighter text-spectral1 dark:text-foreground",
        className
      )}
      {...props}
    >
      {children}
    </h4>
  );
}

export function Descriptor({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "text-stone-600 dark:text-stone-400 font-normal",
        className
      )}
    >
      {children}
    </span>
  );
}

export function TypographySmall({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <p
      className={cn(
        "text-xs text-stone-700 dark:text-muted-foreground",
        className
      )}
    >
      {children}
    </p>
  );
}
