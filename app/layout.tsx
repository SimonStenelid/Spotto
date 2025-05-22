import * as React from "react";
import { Toaster } from "@/components/ui/toaster"
import { PreviewBanner } from "./components/ui/preview-banner"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <PreviewBanner />
        {children}
        <Toaster />
      </body>
    </html>
  )
} 