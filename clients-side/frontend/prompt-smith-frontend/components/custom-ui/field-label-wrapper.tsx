import {FormDescription, FormLabel} from "@/components/ui/form";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {Info} from "lucide-react";


/**
 * Field Label Wrapper
 * With label, tooltip and description
 * @param name
 * @param description
 * @param required
 * @constructor
 */
const FeildLabelWrapper = (
  {name, description, required}: { name: string, description: string, required?: boolean }
) => {
  return (
    <FormLabel>
      {name}{required && <span className="text-red-500">*</span>}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="hidden md:inline" type="button">
            <Info className={"inline w-4 h-4 ml-1"}/>
          </TooltipTrigger>
          <TooltipContent>
            <p>{description}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <FormDescription className="inline md:hidden ml-1">
        {description}
      </FormDescription>
    </FormLabel>
  )
}

export default FeildLabelWrapper
