import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "@repo/ui/components/core/sonner";
import { Providers } from "./providers";
import "@repo/ui/globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: { default: "Tickora", template: "%s · Tickora" },
  description: "Tickora web application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
