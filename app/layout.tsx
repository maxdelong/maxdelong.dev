import type { Metadata } from "next";
import { Sidebar } from "@/components/sidebar/Sidebar";
import "./globals.css";

export const metadata: Metadata = {
  title: "maxdelong.dev",
  description: "Personal site with tools and experiments.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen flex-col md:flex-row">
          <Sidebar />
          <main className="flex-1 p-6 md:p-10">{children}</main>
        </div>
      </body>
    </html>
  );
}
