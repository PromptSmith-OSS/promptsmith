import * as React from "react";
import DashboardLayout from "@/components/layout/dashboard-layout";

const Layout = ({
                  children,
                }: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <DashboardLayout pageTitle={'Prompts'}>
      {children}
    </DashboardLayout>
  )
}

export default Layout
