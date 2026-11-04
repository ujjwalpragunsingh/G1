"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

// Both icons are always rendered and swapped with the `dark:` variant,
// so the button needs no "mounted" check and never flashes the wrong icon.
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
      className="relative flex size-8 items-center justify-center rounded-full bg-foreground/5 text-foreground/70 transition-colors hover:bg-foreground/15 hover:text-foreground"
    >
      <Sun aria-hidden="true" className="size-4 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
      <Moon aria-hidden="true" className="absolute size-4 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
    </button>
  );
}
