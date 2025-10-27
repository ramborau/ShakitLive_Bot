import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@/lib/init-services";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ShakitLive Bot - Messenger Chat",
  description: "Facebook Messenger webhook chat application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.Node;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
