import Link from "next/link";
import * as React from "react";
import SideBarUpgradeCard from "@/components/layout/sideBarUpgradeCard";
import SideBarContent from "@/components/layout/sideBarContent";
import Logo from "@/components/custom-ui/logo";


const SideBar = () => {
  return (
    <div className="hidden border-r bg-muted/60 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Logo/>
          </Link>
        </div>
        <div className="flex-1">
          <SideBarContent/>
        </div>
        <div className="mt-auto p-4">
          <SideBarUpgradeCard/>
        </div>
      </div>
    </div>
  )
}

export default SideBar
