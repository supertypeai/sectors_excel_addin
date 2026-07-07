import { cva } from "class-variance-authority";

export const toggleVariants = cva(
  "inline-flex border border-stone-200 hover:border-stone-400 items-center justify-center gap-2 rounded-md text-sm font-medium hover:bg-card disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:border-stone-400 outline-none transition-colors",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline:
          "bg-transparent shadow-xs hover:bg-card",
      },
      size: {
        default: "h-9 px-2 min-w-9",
        sm: "h-8 px-2.5 min-w-8",
        lg: "h-10 px-2.5 min-w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
