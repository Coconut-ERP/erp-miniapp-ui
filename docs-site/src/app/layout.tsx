import type { Metadata } from "next";
import { AppToaster } from "@/components/app-toaster";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "@erp/miniapp-ui",
    template: "%s · @erp/miniapp-ui",
  },
  description: "Live UI showcase for the ERP mini app design system",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <AppToaster />
      </body>
    </html>
  );
}
