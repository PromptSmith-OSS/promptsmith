import {Sheet, SheetContent, SheetTrigger} from "@/components/ui/sheet";
import {Button} from "@/components/ui/button";
import {Menu} from "lucide-react";
import * as React from "react";
import SidebarContent from "@/components/layout/sidebar-content";
import SidebarDemoCard from "@/components/layout/sidebar-demo-card";


const SidebarMobile = () => {
  return (
    <div className='bg-muted/100'>
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="shrink-0 md:hidden"
          >
            <Menu className="h-5 w-5"/>
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col bg-muted/90 min-w-64">
          <SidebarContent />
          <div className="mt-auto p-4">
            <SidebarDemoCard/>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default SidebarMobile
