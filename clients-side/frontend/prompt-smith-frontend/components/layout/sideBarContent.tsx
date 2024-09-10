import Link from "next/link";
import {Badge, Home, LineChart, Package, Package2, ShoppingCart, Users} from "lucide-react";
import * as React from "react";


const SideBarContent = () => {
  return (
    <>
      <nav className="grid items-start px-0 md:px-2 text-lg md:text-sm font-medium lg:px-4 gap-2 md:gap-0">

        <Link
          href="#"
          className="flex items-center gap-2 text-lg font-semibold md:hidden mb-4"
        >
          {/*todo Logo and Title in Side Bar*/}
          <Package2 className="h-6 w-6"/>
          <span className="sr-only">Prompt Smith</span>
        </Link>


        <Link
          href="#"
          className="mx-[-0.65rem] md:mx-0 flex items-center gap-4 md:gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
        >
          <Home className="h-5 w-5 md:h-4 md:w-4"/>
          Dashboard
        </Link>
        <Link
          href="#"
          className="mx-[-0.65rem] md:mx-0 flex items-center gap-4 md:gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
        >
          <ShoppingCart className="h-5 w-5 md:h-4 md:w-4"/>
          Orders
          <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
            6
          </Badge>
        </Link>
        <Link
          href="#"
          className="mx-[-0.65rem] md:mx-0 flex items-center gap-4 md:gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary"
        >
          <Package className="h-5 w-5 md:h-4 md:w-4"/>
          Products{" "}
        </Link>
        <Link
          href="#"
          className="mx-[-0.65rem] md:mx-0 flex items-center gap-4 md:gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
        >
          <Users className="h-5 w-5 md:h-4 md:w-4"/>
          Customers
        </Link>
        <Link
          href="#"
          className="mx-[-0.65rem] md:mx-0 flex items-center gap-4 md:gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
        >
          <LineChart className="h-5 w-5 md:h-4 md:w-4"/>
          Analytics
        </Link>
      </nav>
    </>
  )
}

export default SideBarContent
