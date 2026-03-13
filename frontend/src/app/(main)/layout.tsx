import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { Providers } from "~/components/providers";
import { AppSidebar } from "~/components/sidebar/app-sidebar";
import BreadcrumbPageClient from "~/components/sidebar/breadcrumb-page-client";
import SoundBar from "~/components/sound-bar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList } from "~/components/ui/breadcrumb";
import { Separator } from "~/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar";
import { Toaster } from "~/components/ui/sonner";

export const metadata: Metadata = {
  title: "HarmonyAI — AI Music Studio",
  description: "Create and share AI-generated music with HarmonyAI",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} dark`}>
      <body>
        <Providers>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="flex h-screen min-w-0 flex-col overflow-hidden bg-background">
              {/* Top header bar */}
              <header className="sticky top-0 z-10 flex h-12 flex-shrink-0 items-center gap-2 border-b border-border/60 bg-background/80 px-4 backdrop-blur-sm">
                <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground" />
                <Separator
                  orientation="vertical"
                  className="mr-1 data-[orientation=vertical]:h-4 bg-border/60"
                />
                <Breadcrumb>
                  <BreadcrumbList className="text-xs text-muted-foreground">
                    <BreadcrumbItem>
                      <BreadcrumbPageClient />
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </header>

              {/* Page content */}
              <main className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">{children}</main>

              {/* Player */}
              <SoundBar />
            </SidebarInset>
          </SidebarProvider>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
