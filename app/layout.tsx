import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "Aryan Chaudhary",
  description: "Personal portfolio of Aryan Chaudhary",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // 'h-full' hata diya hai taaki height restrict na ho
    <html lang="en" className={cn("antialiased", "font-sans", geist.variable)} suppressHydrationWarning>
      <body className="min-h-screen bg-black text-white font-sans">
        {/* Yahan {children} hona bohot zaroori hai! */}
        {children}
      </body>
    </html>
  );
}