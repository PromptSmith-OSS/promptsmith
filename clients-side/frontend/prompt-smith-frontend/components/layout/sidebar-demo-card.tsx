import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import * as React from "react";


const SidebarDemoCard = () => {
  return (

    <Card>
      <CardHeader className="p-2 p-4">
        <CardTitle>Notice</CardTitle>
      </CardHeader>
      <CardContent className="p-2 p-4">
        <p className="">
          This is a demo instance of PromptSmith.
        </p>
        <ul className="text-sm list-disc mt-2 pl-2">
          <li>
            Please note that the data you enter will be visible to other users of the instance.
          </li>
          <li>
            The data for this instance will be reset at regular intervals.
          </li>
        </ul>
        <hr className="my-1"/>
        <p className="text-sm">
          <strong>You can login with the following credentials:</strong>
          <br/>
          email: <i>admin@localhost.lan</i>
          <br/>
          password: <i>AwesomePromptsManagement</i>
        </p>
      </CardContent>
    </Card>
  )
}

export default SidebarDemoCard
