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
import {Prompt} from "@/lib/interfaces";
import PromptPage from "@/components/features/prompt";

const getAllPrompts = async ():Promise<Prompt[]> => {
  const selfUrl = process.env.NEXT_PUBLIC_BASE_URL
  const response = await fetch(selfUrl+'/api/bff/api/prompt', {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    }
  })
  const data = await response.json()
  console.log(response.status, data, response.statusText)
  return data.items
}



export async function Page() {
  const prompts = await getAllPrompts()

  return (
    <div className='w-full'>
      {/*<pre>*/}
      {/*  <code>*/}
      {/*    {JSON.stringify(prompts, null, 2)}*/}
      {/*  </code>*/}
      {/*</pre>*/}
      {/*<Table>*/}
      {/*  <TableCaption>A list of your recent invoices.</TableCaption>*/}
      {/*  <TableHeader>*/}
      {/*    <TableRow>*/}
      {/*      <TableHead className="w-[100px]">Key</TableHead>*/}
      {/*      <TableHead>Method</TableHead>*/}
      {/*      <TableHead className="text-right">Amount</TableHead>*/}
      {/*    </TableRow>*/}
      {/*  </TableHeader>*/}
      {/*  <TableBody>*/}
      {/*    {prompts?.map((prompt) => (*/}
      {/*      <TableRow key={prompt.unique_key}>*/}
      {/*        <TableCell className="font-medium">*/}
      {/*          {prompt.unique_key}*/}
      {/*          <br/>*/}
      {/*          <span className="text-xs text-gray-500">{prompt.description}</span>*/}
      {/*        </TableCell>*/}
      {/*        <TableCell></TableCell>*/}
      {/*        /!*<TableCell>{invoice.paymentMethod}</TableCell>*!/*/}
      {/*        /!*<TableCell className="text-right">{invoice.totalAmount}</TableCell>*!/*/}
      {/*      </TableRow>*/}
      {/*    ))}*/}
      {/*  </TableBody>*/}
      {/*  <TableFooter>*/}
      {/*    /!*<TableRow>*!/*/}
      {/*    /!*  <TableCell colSpan={3}>Total</TableCell>*!/*/}
      {/*    /!*  <TableCell className="text-right">$2,500.00</TableCell>*!/*/}
      {/*    /!*</TableRow>*!/*/}
      {/*  </TableFooter>*/}
      {/*</Table>*/}
      <PromptPage />
    </div>
  )
}

export default Page
