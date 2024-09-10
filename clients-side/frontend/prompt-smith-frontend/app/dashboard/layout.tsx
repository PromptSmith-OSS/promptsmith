import * as React from "react";
import DashboardLayout from "@/components/layout/dashboardLayout";

const Layout = ({
                  children,
                }: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  )
}

export default Layout
