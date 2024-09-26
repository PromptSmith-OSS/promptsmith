import Link from "next/link";
import {Package, SquareLibrary, Users} from "lucide-react";
import * as React from "react";
import Logo from "@/components/custom-ui/logo";
import WIPHover from "@/components/custom-ui/wip-hover";
import SidebarLinkNav from "@/components/client/sidebar-link-nav";


const SidebarContent = () => {


  return (
    <>
      <nav className="grid items-start gap-2 px-0 text-lg font-medium md:gap-0 md:px-2 md:text-sm lg:px-4">
        <Link
          href="/"
          className="mb-4 flex items-center gap-2 text-lg font-semibold md:hidden"
        >
          {/*todo Logo and Title in Side Bar*/}
          <Logo/>
        </Link>

        {/*<Link*/}
        {/*  href="/"*/}
        {/*  className="flex items-center gap-4 rounded-lg px-3 py-2 transition-all mx-[-0.65rem] text-muted-foreground hover:text-primary md:mx-0 md:gap-3"*/}
        {/*>*/}
        {/*  <Home className="h-5 w-5 md:h-4 md:w-4"/>*/}
        {/*  Dashboard*/}
        {/*          <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">*/}
        {/*    6*/}
        {/*  </Badge>*/}
        {/* todo add metrics here  */}
        {/*</Link>*/}

        <section>
          <span className="sr-only">Prompts Menu</span>
          <SidebarLinkNav href="/prompt">
            <SquareLibrary className="h-5 w-5 md:h-4 md:w-4"/>
            Prompts
          </SidebarLinkNav>
        </section>


        {/*<div*/}
        {/*  className="flex items-center gap-4 rounded-lg px-3 py-2 transition-all mx-[-0.65rem] text-muted-foreground hover:text-primary md:mx-0 md:gap-3"*/}
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
        {/*  className="flex items-center gap-4 rounded-lg px-3 py-2 transition-all mx-[-0.65rem] text-muted-foreground hover:text-primary md:mx-0 md:gap-3"*/}
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

        <section>
          <span className="sr-only">Support Page</span>
          <SidebarLinkNav href="/support">
            <SquareLibrary className="h-5 w-5 md:h-4 md:w-4"/>
            Support
          </SidebarLinkNav>
        </section>
        <section>
          <span className="sr-only">Document Page</span>
          <SidebarLinkNav href="/doc">
            <SquareLibrary className="h-5 w-5 md:h-4 md:w-4"/>
            Documentation
          </SidebarLinkNav>
        </section>
        {/*todo support audit logs*/}
        {/*<Link*/}
        {/*  href="/logs"*/}
        {/*  className="flex items-center gap-4 rounded-lg px-3 py-2 transition-all mx-[-0.65rem] text-muted-foreground hover:text-primary md:mx-0 md:gap-3"*/}
        {/*>*/}
        {/*  <LineChart className="h-5 w-5 md:h-4 md:w-4"/>*/}
        {/*  Audit Log*/}
        {/*</Link>*/}
      </nav>
    </>
  )
}

export default SidebarContent
