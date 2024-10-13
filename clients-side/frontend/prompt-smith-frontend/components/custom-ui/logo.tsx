import {Anvil} from "lucide-react";
import * as React from "react";
import {IS_IN_DEMO_MODE} from "@/lib/constants";


const Logo = () => {
  return (
    <>
      <Anvil className="h-6 w-6"/>
      <span className="">
        Prompt Smith
        {IS_IN_DEMO_MODE && (
          <span className="text-xs text-muted-foreground"> (demo)</span>
        )}
      </span>
    </>
  )
}

export default Logo
