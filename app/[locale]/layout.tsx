import "./globals.css";
import React from "react";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { ThemeProvider } from "@/lib/theme-context";
import { AddFormProvider } from "@/contexts/AddFormContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { KeyboardNavigationProvider } from "@/components/KeyboardNavigationProvider";
import { ConditionalLayout } from "@/components/ConditionalLayout";

export async function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ur" }];
}

export const metadata = {
  title: "Mohsin Steels",
  description: "Business process automation dashboard",
  icons: "/logo.png",
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  let messages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }

  return (
    <html lang={locale} suppressHydrationWarning data-scroll-behavior="smooth">
      <body className="font-sans h-screen" suppressHydrationWarning>
        <ThemeProvider>
          <AuthProvider>
            <NextIntlClientProvider locale={locale} messages={messages}>
              <AddFormProvider>
                <KeyboardNavigationProvider>
                  <ConditionalLayout>{children}</ConditionalLayout>
                </KeyboardNavigationProvider>
              </AddFormProvider>
            </NextIntlClientProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
