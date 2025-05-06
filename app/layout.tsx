import "@/styles/globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "IKAPRAMA Admin",
  description: "Dashboard admin IKAPRAMA",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
