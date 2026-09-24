import type { Metadata } from "next";
import { DM_Serif_Display, Manrope, Noto_Sans_Devanagari } from "next/font/google";
import { ThemeProvider } from "@/components/svarupa/ThemeProvider";
import { DISCLAIMER } from "@/lib/constants";
import "./globals.css";

const serif = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-serif",
});

const sans = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
});

const deva = Noto_Sans_Devanagari({
  subsets: ["devanagari", "latin"],
  variable: "--font-deva",
});

export const metadata: Metadata = {
  title: {
    default: "SVARUPA — Look within.",
    template: "%s · SVARUPA",
  },
  description:
    "A quiet space to understand what you're feeling, explore timeless wisdom, and develop practices that help you live more deliberately.",
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${serif.variable} ${sans.variable} ${deva.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-background font-sans text-foreground">
        <ThemeProvider>
          <a href="#main" className="skip-link">
            Skip to content
          </a>
          {children}
          <p className="sr-only">{DISCLAIMER}</p>
        </ThemeProvider>
      </body>
    </html>
  );
}
