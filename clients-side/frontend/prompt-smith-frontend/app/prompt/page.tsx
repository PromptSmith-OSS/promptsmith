import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {getBearerTokenFromSession} from "@/lib/session";
import Prompt from "@/components/features/prompt";




export async function Page() {


  return (
    <Prompt
      />
  )
}

export default Page
