import type { Metadata } from "next";

import "./globals.css";
import { inter } from "@/components/ui/fonts";
import { Navbar } from "@/components/navbar";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProviderWrapper } from "@/components/theme-provider-wrapper";
import { RemoveScroll } from "react-remove-scroll";
import ReactQueryProvider from "@/provider/react-query-provider";
export const metadata: Metadata = {
  title: "Yeka corruption report",
  description: "A platform to report corruption in Yeka",
  icons: {
    icon: "/logo.png",
    shortcut: "/favicon.ico",
    apple: "/logo.png",
  },
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${inter.className} antialiased min-h-screen flex flex-col relative bg-background text-foreground `}
      >
        <ReactQueryProvider>
          <NextIntlClientProvider>
            <ThemeProviderWrapper>
              <main className="flex-1 w-full">
                <div
                  className={`mx-auto flex items-center justify-center w-full    max-w-screen-4xl fixed top-0 left-0 right-0 z-50 bg-background ${RemoveScroll.classNames.zeroRight}`}
                >
                  <Navbar />
                </div>
                <div className="lg:mt-24 mt-10">{children}</div>
                <Toaster richColors={true} />
              </main>
            </ThemeProviderWrapper>
          </NextIntlClientProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
