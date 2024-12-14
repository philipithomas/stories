import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { StoriesStoreProvider } from "@/providers/StoriesStoreProvider";
import Image from "next/image";
import Link from "next/link";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Stories",
  description: "An experiment from Philip",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <StoriesStoreProvider>
          <div className="min-h-screen bg-white flex">
            <aside className="flex flex-col items-center p-4 border-r border-gray-300">
              <Link href="/">
                <Image
                  src="/instagram_icon.svg"
                  alt="Instagram logo"
                  width={32}
                  height={32}
                  className="mt-[39px] mx-[25px] mb-4"
                />
              </Link>
            </aside>
            <main className="p-4 flex-1">
              {children}
            </main>
          </div>
        </StoriesStoreProvider>
      </body>
    </html>
  );
}
