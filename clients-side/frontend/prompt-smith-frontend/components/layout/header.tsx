import {Button} from "@/components/ui/button";
import {CircleUser} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import * as React from "react";
import {ModeToggle} from "@/components/client/theme-toggle";
import SidebarMobile from "./sidebar-mobile";
import Logout from "@/components/features/logout";

const Header = () => {


  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      <SidebarMobile/>
      <div className="w-full flex-1">
        {/*<form>*/}
        {/*  <div className="relative">*/}
        {/*    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"/>*/}
        {/*    <Input*/}
        {/*      type="search"*/}
        {/*      placeholder="Quick navigation"*/}
        {/*      className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"*/}
        {/*    />*/}
        {/*  </div>*/}
        {/*</form>*/}
      </div>
      <ModeToggle/>
      {/*<Button variant="outline" size="icon" className="ml-auto h-9 w-9">*/}
      {/*  <Bell className="h-4 w-4"/>*/}
      {/*  <span className="sr-only">Toggle notifications</span>*/}
      {/*</Button>*/}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full">
            <CircleUser className="h-5 w-5"/>
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          {/*<DropdownMenuSeparator/>*/}
          {/*<DropdownMenuItem>Settings</DropdownMenuItem>*/}
          {/*<DropdownMenuItem>Support</DropdownMenuItem>*/}
          <DropdownMenuSeparator/>
          <Logout/>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}

export default Header
