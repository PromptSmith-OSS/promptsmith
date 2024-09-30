'use client'
import PromptEdit from "@/components/features/prompt-edit";
import {useState} from "react";
import {PromptFormData} from "@/lib/api/interfaces";


function PromptCreate() {

  const [promptDefaultData, setPromptDefaultData] = useState<PromptFormData>({
    unique_key: "",
    description: "",
    enabled: true,
    variants: [],
    uuid: undefined,
  })


  return (
    <>
      <PromptEdit promptDetailData={promptDefaultData} mutate={setPromptDefaultData}/>
    </>
  )
}


export default PromptCreate
