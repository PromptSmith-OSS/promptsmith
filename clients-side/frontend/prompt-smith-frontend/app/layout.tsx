import type {Metadata} from "next";
import localFont from "next/font/local";
import "./globals.css";
import {ThemeProvider} from "@/components/client/theme-provider"
import Head from "next/head";


const geistSans = localFont({
  src: "../public/fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../public/fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Prompt Smith",
  description: "Manage your AI prompt with ease.",
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <Head>
      <meta charSet="utf-8"/>
      <meta
        name="keywords"
        key="keywords"
        content="Blog, content"
      />
      <meta
        name="viewport"
        key="viewport"
        content="width=device-width, initial-scale=1.0"
      />
      <meta
        name="description"
        key="description"
        content="Welcome to Debjit blog."
      />
      <meta name="viewport" content="width=device-width, initial-scale=1"/>
    </Head>
    <body
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
    </body>
    </html>
  );
}
