import * as React from "react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import {Button} from "@/components/ui/button";
import {Share} from "lucide-react";

const DashboardLayout = ({
                           pageTitle = 'Dashboard',
                           children,
                         }: Readonly<{
  pageTitle?: string;
  children: React.ReactNode;
}>) => {
  return (
    <>
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <Sidebar/>
        <div className="flex flex-col">
          <Header/>
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6  max-w-screen-2xl w-full mx-auto">
            {/*<div className="flex items-center">*/}
            {/*  <h1 className="text-lg font-semibold md:text-2xl">{pageTitle}</h1>*/}
            {/*</div>*/}
            <section className=" top-0 z-10 flex items-center gap-1 bg-background px-4">
              <h1 className="text-lg font-semibold lg:text-2xl">{pageTitle}</h1>
              {/*<Button*/}
              {/*  variant="outline"*/}
              {/*  size="sm"*/}
              {/*  className="ml-auto gap-1.5 text-sm"*/}
              {/*>*/}
              {/*  <Share className="size-3.5"/>*/}
              {/*  Share*/}
              {/*/!*  todo share function *!/*/}
              {/*</Button>*/}
            </section>
            <div
              className="flex flex-1 justify-center rounded-lg border border-dashed shadow-sm p-4 md:p-6 "
            >
              {children}
            </div>
          </main>
        </div>
      </div>
    </>
  )
}

export default DashboardLayout
