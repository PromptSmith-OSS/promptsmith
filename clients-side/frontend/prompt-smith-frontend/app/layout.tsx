import type {Metadata} from "next";
import localFont from "next/font/local";
import "./globals.css";
import {ThemeProvider} from "@/components/client/theme-provider"
import Head from "next/head";
import * as React from "react"

import {Toaster} from "@/components/ui/toaster"

const geistSans = localFont({
  src: "../assets/fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../assets/fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Prompt Smith",
  description: "Manage your AI prompt with ease.",
  keywords: ["AI", "LLM", "Prompt", "Prompt Smith"],

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
      <meta name="viewport" content="width=device-width, initial-scale=1"/>
      <link rel="shortcut icon" href="/favicon.ico"/>
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
    </Head>
    <body
      className={`${geistSans.variable} ${geistMono.variable} antialiased min-w-sm`}
    >
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
      <Toaster/>
    </ThemeProvider>
    </body>
    </html>
  )
}

