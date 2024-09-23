import PromptPage from "@/components/features/prompt";
import {Button} from "@/components/ui/button";


export async function Page() {
  return (
    <div className='w-full'>
      <div className="flex flex-row w-full justify-between pb-2 mb-2">
        <div></div>
        <Button variant="default" size="default" className="flex items-center justify-center">
          Create Prompt
        </Button>
      </div>
      <PromptPage/>
    </div>
  )
}

export default Page
