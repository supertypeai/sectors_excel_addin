"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "../../lib/utils";

const Tabs = TabsPrimitive.Root;

function TabsList({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      className={cn(
        "flex w-full items-center border-b border-border",
        className
      )}
      {...props}
    />
  );
}

function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        "flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium transition-colors relative",
        "text-foreground/80 hover:text-foreground",
        "data-[state=active]:text-spectral1",
        "after:absolute after:bottom-0 after:left-1/4 after:right-1/4 after:h-0.5 after:rounded-full after:bg-spectral1 after:scale-x-0 after:transition-transform",
        "data-[state=active]:after:scale-x-100",
        className
      )}
      {...props}
    />
  );
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      className={cn("flex-1 overflow-y-auto", className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
