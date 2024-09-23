import PromptTable from "@/components/features/prompt";
import {Button} from "@/components/ui/button";
import Link from "next/link";


export async function Page() {
  return (
    <div className='w-full'>
      <div className="flex flex-row w-full justify-between pb-2 mb-2">
        <div></div>
        <Button variant="default" size="default" className="flex items-center justify-center" asChild>
          <Link href={'/prompt/create'}>
            Create Prompt
          </Link>
        </Button>
      </div>
      <PromptTable/>
    </div>
  )
}

export default Page
