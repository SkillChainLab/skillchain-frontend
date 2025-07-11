import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AppLayout from '@/components/layout/AppLayout'

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "SkillChain - Decentralized Freelancing Platform",
  description: "Connect talent with opportunity on the blockchain. Secure payments, transparent contracts, and global accessibility.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} antialiased`}>
        <AppLayout>
          {children}
        </AppLayout>
      </body>
    </html>
  );
}
