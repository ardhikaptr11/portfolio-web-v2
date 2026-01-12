"use client";

import React, { Fragment } from "react";
import { ActiveThemeProvider } from "../active-theme";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function Providers({
  activeThemeValue,
  children,
}: {
  activeThemeValue: string;
  children: React.ReactNode;
}) {
  return (
    <Fragment>
      <ActiveThemeProvider initialTheme={activeThemeValue}>
        <TooltipProvider>{children}</TooltipProvider>
      </ActiveThemeProvider>
    </Fragment>
  );
}
