import type {Metadata} from "next";
import localFont from "next/font/local";
import "./globals.css";
import {ThemeProvider} from "@/components/client/theme-provider"
import Head from "next/head";
import * as React from "react"
import SideBar from "@/components/layout/sideBar";
import Header from "@/components/layout/header";


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
    </Head>
    <body
      className={`${geistSans.variable} ${geistMono.variable} antialiased `}
    >
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <SideBar/>
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <Header/>
          <main >
            {children}
          </main>
        </div>
      </div>
    </ThemeProvider>
    </body>
    </html>
  )
}

