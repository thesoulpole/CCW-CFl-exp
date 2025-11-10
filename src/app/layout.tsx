import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";

export const metadata: Metadata = {
  title: {
    default: "NextJS Login & Tiles - Modern Web Application",
    template: "%s | NextJS Login & Tiles"
  },
  description: "A beautiful, modern Next.js application featuring authentication, interactive tile selection, and responsive design with TypeScript and Tailwind CSS",
  keywords: ["nextjs", "react", "typescript", "tailwind css", "authentication", "login", "tiles", "responsive design", "modern ui"],
  authors: [{ name: "Your Name" }],
  creator: "Your Name",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "NextJS Login & Tiles - Modern Web Application",
    description: "A beautiful, modern Next.js application featuring authentication and interactive tile selection",
    siteName: "NextJS Login & Tiles",
  },
  twitter: {
    card: "summary_large_image",
    title: "NextJS Login & Tiles - Modern Web Application",
    description: "A beautiful, modern Next.js application featuring authentication and interactive tile selection",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
