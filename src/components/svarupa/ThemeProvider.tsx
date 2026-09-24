"use client";

import { ThemeProvider as NextThemes } from "next-themes";
import { ToastProvider } from "@/components/ui/toast";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemes attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <ToastProvider>{children}</ToastProvider>
    </NextThemes>
  );
}
