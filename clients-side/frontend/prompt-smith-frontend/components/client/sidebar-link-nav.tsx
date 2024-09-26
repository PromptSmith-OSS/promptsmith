'use client'
import Link from "next/link";
import * as React from "react";
import {usePathname} from "next/navigation";

const SidebarLinkNav = ({href, children}: { href: string; children: React.ReactNode }) => {

  const pathname = usePathname();  // Get the current pathname from the app router


  const getClassNamesOnThePage = (path: string) => {
    return pathname.startsWith(path) ? " text-primary bg-muted font-bold" : ""
  }


  return (
    <Link
      href={href}
      className={"flex items-center gap-4 rounded-lg px-3 py-2 transition-all mx-[-0.65rem] text-muted-foreground hover:text-primary md:mx-0 md:gap-3" + getClassNamesOnThePage(href)}
    >
      {children}
    </Link>
  )
}

export default SidebarLinkNav
