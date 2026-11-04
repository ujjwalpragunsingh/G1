import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { SETS } from "@/data/sets";
import { FULL_DAY_HOURS, HALF_DAY_HOURS, MIN_CUSTOM_HOURS } from "@/data/studio";
import { OPEN_GRAPH_BASE, SITE_NAME, SITE_URL, shareImage } from "@/lib/site";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const TITLE = `${SITE_NAME} — Photo & film studio sets in Noida`;
const DESCRIPTION = `${SETS.length} designed studio sets in Sector 49, Noida for photo, film and fashion shoots. Book ${HALF_DAY_HOURS}- or ${FULL_DAY_HOURS}-hour slots, or custom from ${MIN_CUSTOM_HOURS} hours, on WhatsApp.`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: `%s · ${SITE_NAME}` },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: {
    ...OPEN_GRAPH_BASE,
    title: TITLE,
    description: DESCRIPTION,
    images: [shareImage("home", "The Girgit Studios floor in Noida")],
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={spaceGrotesk.variable}
      // Smooth in-page scrolling, but instant jumps on page changes
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <ThemeProvider attribute="class" defaultTheme="light" disableTransitionOnChange>
          <SmoothScroll />
          <Navbar />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
