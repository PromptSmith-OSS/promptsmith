import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import * as React from "react";


const SideBarUpgradeCard = () => {
  return (
      <Card x-chunk="dashboard-02-chunk-0">
        <CardHeader className="p-2 p-4">
          <CardTitle>Upgrade to Pro</CardTitle>
          <CardDescription>
            Unlock all features and get unlimited access to our support
            team.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-2 p-4">
          <Button size="sm" className="w-full">
            Upgrade
          </Button>
        </CardContent>
      </Card>

  )
}

export default SideBarUpgradeCard
