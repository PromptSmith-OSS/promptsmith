import * as React from "react";
import SideBar from "@/components/layout/sideBar";
import Header from "@/components/layout/header";

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
        <SideBar/>
        <div className="flex flex-col">
          <Header/>
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            <div className="flex items-center">
              <h1 className="text-lg font-semibold md:text-2xl">{pageTitle}</h1>
            </div>
            <div
              className="flex flex-1 justify-center rounded-lg border border-dashed shadow-sm p-4"
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
