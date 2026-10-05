import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Design Stuff — Frontend Mood Board & UI Archive",
  description: "Curated mood board of interactive frontend UI designs, micro-interactions, motion hooks, and skeuomorphic components.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full font-sans antialiased bg-background text-foreground" suppressHydrationWarning>
        <Providers>
          <main className="bg-background text-foreground">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
