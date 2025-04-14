import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { ToastProvider } from '@/hooks/toast-context'

export const metadata: Metadata = {
  title: "E-Shop",
  description: "Your best choice",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body >
        <ThemeProvider>
          <ToastProvider>
            {children}
            </ToastProvider>
        </ThemeProvider>
        
      </body>
    </html>
  );
}
