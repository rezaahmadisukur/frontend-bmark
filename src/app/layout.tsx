import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "~/lib/utils";
import { AppProvider } from "~/context/AppContext";
import { QueryProvider } from "~/lib/query-provider";
import { ThemeProvider } from "~/context/theme-provider";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "~/components/ui/toast";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "B-Mark — Kelola Bookmark Anda dengan Elegan",
  description:
    "Tempat untuk menyimpan, mengorganisir, dan menemukan kembali semua bookmark favorit Anda. Cepat, elegan, dan selalu siap membantu."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        inter.variable
      )}
    >
      <body>
        <ThemeProvider>
          <QueryProvider>
            <Toaster>
              <AppProvider>
                <NuqsAdapter>{children}</NuqsAdapter>
              </AppProvider>
            </Toaster>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
