import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border border-stone-200 px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-stone-950 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-stone-900 text-stone-50 shadow hover:bg-stone-900/80",
        secondary:
          "border-transparent bg-stone-300/30 hover:bg-stone-200 shadow-inner",
        destructive:
          "border-transparent bg-red-500 text-stone-50 shadow hover:bg-red-500/80",
        outline:
          "text-stone-950 border border-stone-400 hover:bg-stone-200",
        success:
          "text-green-600 border border-green-600",
        warning:
          "text-yellow-600 border border-yellow-600",
        rose: "shadow bg-stone-100 border border-l-2 border-l-spectral1 hover:bg-stone-200 hover:cursor-pointer",
        link: "border-transparent bg-stone-300/60 hover:bg-stone-300 shadow-inner cursor-pointer",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  href?: string;
}

function Badge(props: BadgeProps) {
  if (props.href) {
    const { className, variant, href, ...linkProps } = props;
    const classes = cn(badgeVariants({ variant }), className);
    return (
      <a
        href={href}
        className={classes}
        {...(linkProps as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      />
    );
  }

  const { className, variant, href: _href, ...divProps } = props;
  const classes = cn(badgeVariants({ variant }), className);
  return <div className={classes} {...divProps} />;
}

export { Badge, badgeVariants };
