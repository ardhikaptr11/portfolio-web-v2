"use client";

import { useThemeConfig } from "./active-theme";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Icons } from "@/components/icons";
import { THEMES } from "./theme.config";
import { Fragment } from "react/jsx-runtime";

export function ThemeSelector() {
  const { activeTheme, setActiveTheme } = useThemeConfig();

  return (
    <div className="flex items-center gap-2">
      <Label htmlFor="theme-selector" className="sr-only">
        Theme
      </Label>
      <Select value={activeTheme} onValueChange={setActiveTheme}>
        <SelectTrigger
          id="theme-selector"
          className="justify-start *:data-[slot=select-value]:w-24"
        >
          <span className="hidden text-muted-foreground sm:block">
            <Icons.palette />
          </span>
          <span className="block text-muted-foreground sm:hidden">Theme</span>
          <SelectValue placeholder="Select a theme" />
        </SelectTrigger>
        <SelectContent align="end" position="popper">
          {THEMES.length > 0 && (
            <Fragment>
              <SelectGroup>
                <SelectLabel>Themes</SelectLabel>
                {THEMES.map((theme) => (
                  <SelectItem key={theme.name} value={theme.value}>
                    {theme.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </Fragment>
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
