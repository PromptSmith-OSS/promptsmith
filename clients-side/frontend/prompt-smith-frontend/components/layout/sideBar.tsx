import Link from "next/link";
import {Badge, Bell, Home, LineChart, Package, Package2, ShoppingCart, Users} from "lucide-react";
import * as React from "react";
import {Button} from "@/components/ui/button";
import SideBarUpgradeCard from "@/components/layout/sideBarUpgradeCard";
import SideBarContent from "@/components/layout/sideBarContent";


const SideBar = () => {
  return (
    <div className="hidden border-r bg-muted/60 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Package2 className="h-6 w-6"/>
            <span className="">Prompt Smith</span>
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
