"use client";

import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useInfobar, type InfobarContent } from "@/components/ui/infobar";
import { cn } from "@/lib/utils";
import { ComponentProps, MouseEvent, useEffect } from "react";

interface InfoButtonProps extends Omit<
  ComponentProps<typeof Button>,
  "content"
> {
  content: InfobarContent;
  variant?:
    | "default"
    | "ghost"
    | "outline"
    | "secondary"
    | "destructive"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

export function InfoButton({
  content,
  className,
  variant = "ghost",
  size = "icon",
  ...props
}: InfoButtonProps) {
  const { setContent, setOpen } = useInfobar();

  // Automatically set content when component mounts (e.g., on page load/refresh)
  useEffect(() => {
    setContent(content);
  }, [content, setContent]);

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    setContent(content);
    setOpen(true);
    props.onClick?.(e);
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={cn("shrink-0", className)}
      onClick={handleClick}
      aria-label="Show information"
      {...props}
    >
      <Info className="size-4" />
      <span className="sr-only">Show information</span>
    </Button>
  );
}
