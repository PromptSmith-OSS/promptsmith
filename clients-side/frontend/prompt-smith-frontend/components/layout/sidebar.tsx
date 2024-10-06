import Link from "next/link";
import * as React from "react";
import SidebarContent from "@/components/layout/sidebar-content";
import Logo from "@/components/custom-ui/logo";


const Sidebar = () => {
  return (
    <div className="sticky top-0 left-0 hidden h-screen border-r bg-muted/60 md:block">
      <div className="flex flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Logo/>
          </Link>
        </div>
        <div className="flex-1">
          <SidebarContent/>
        </div>
        {/*<div className="mt-auto p-4">*/}
        {/*  <SideBarUpgradeCard/>*/}
        {/*</div>*/}
      </div>
    </div>
  )
}

export default Sidebar
