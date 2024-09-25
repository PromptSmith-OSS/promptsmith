import Link from "next/link";
import {Package, SquareLibrary, Users} from "lucide-react";
import * as React from "react";
import Logo from "@/components/custom-ui/logo";
import WIPHover from "@/components/custom-ui/wip-hover";


const SideBarContent = () => {
  return (
    <>
      <nav className="grid items-start px-0 md:px-2 text-lg md:text-sm font-medium lg:px-4 gap-2 md:gap-0">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold md:hidden mb-4"
        >
          {/*todo Logo and Title in Side Bar*/}
          <Logo/>
        </Link>

        {/*<Link*/}
        {/*  href="/"*/}
        {/*  className="mx-[-0.65rem] md:mx-0 flex items-center gap-4 md:gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"*/}
        {/*>*/}
        {/*  <Home className="h-5 w-5 md:h-4 md:w-4"/>*/}
        {/*  Dashboard*/}
        {/*          <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">*/}
        {/*    6*/}
        {/*  </Badge>*/}
        {/* todo add metrics here  */}
        {/*</Link>*/}

        <Link
          href="/prompt"
          className="mx-[-0.65rem] md:mx-0 flex items-center gap-4 md:gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary"
        >
          <SquareLibrary className="h-5 w-5 md:h-4 md:w-4"/>
          Prompts
        </Link>
        {/*<div*/}
        {/*  className="mx-[-0.65rem] md:mx-0 flex items-center gap-4 md:gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"*/}
        {/*>*/}
        {/*  <Users className="h-5 w-5 md:h-4 md:w-4"/>*/}
        {/*  <WIPHover>*/}
        {/*    Segments*/}
        {/*    <i>*/}
        {/*      (WIP)*/}
        {/*    </i>*/}
        {/*  </WIPHover>*/}
        {/*</div>*/}

        {/*<div*/}
        {/*  className="mx-[-0.65rem] md:mx-0 flex items-center gap-4 md:gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"*/}
        {/*>*/}
        {/*  <Package className="h-5 w-5 md:h-4 md:w-4"/>*/}
        {/*  <WIPHover>*/}
        {/*    Logs*/}
        {/*    <i>*/}
        {/*      (WIP)*/}
        {/*    </i>*/}
        {/*  </WIPHover>*/}
        {/*</div>*/}

        <hr className="my-2"/>

        <Link
          href="/support"
          className="mx-[-0.65rem] md:mx-0 flex items-center gap-4 md:gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
        >
          <SquareLibrary className="h-5 w-5 md:h-4 md:w-4"/>
          Support
        </Link>

        <Link
          href="/doc"
          className="mx-[-0.65rem] md:mx-0 flex items-center gap-4 md:gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
        >
          <SquareLibrary className="h-5 w-5 md:h-4 md:w-4"/>
          Documentation
        </Link>
        {/*todo support audit logs*/}
        {/*<Link*/}
        {/*  href="/logs"*/}
        {/*  className="mx-[-0.65rem] md:mx-0 flex items-center gap-4 md:gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"*/}
        {/*>*/}
        {/*  <LineChart className="h-5 w-5 md:h-4 md:w-4"/>*/}
        {/*  Audit Log*/}
        {/*</Link>*/}
      </nav>
    </>
  )
}

export default SideBarContent
