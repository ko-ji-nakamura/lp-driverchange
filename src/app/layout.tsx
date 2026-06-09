import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { config } from "@/config/lp";
import "./globals.css";

export const metadata: Metadata = {
  title: `ドライバー転職なら${config.serviceName}`,
  description:
    "かんたん30秒で希望条件を診断できる、ドライバー転職サポートのショートLPです。",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#082f5f",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
