import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ScolarAI - La plateforme intelligente de révision personnalisée",
  description: "Transformez vos documents de cours en outils de révision personnalisés grâce à l'IA. Résumés, flashcards, quiz et assistant conversationnel.",
  keywords: ["ScolarAI", "révision", "IA", "flashcards", "quiz", "étudiants", "apprentissage"],
  authors: [{ name: "ScolarAI Team" }],
  icons: {
    icon: "/scolarai-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
