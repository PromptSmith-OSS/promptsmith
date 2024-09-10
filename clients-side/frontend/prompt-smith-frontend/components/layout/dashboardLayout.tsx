import * as React from "react";
import SideBar from "@/components/layout/sideBar";
import Header from "@/components/layout/header";

const DashboardLayout = ({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <SideBar/>
      <div className="flex flex-col">
        <Header/>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <div className="flex items-center">
            <h1 className="text-lg font-semibold md:text-2xl">Inventory</h1>
          </div>
          <div
            className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm"
            x-chunk="dashboard-02-chunk-1"
          >
            <div className="flex flex-col items-center gap-1 text-center">
              {children}
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

export default DashboardLayout
