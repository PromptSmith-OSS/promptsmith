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


const getAllPrompts = async () => {
  const token = await getBearerTokenFromSession();
  const response = await fetch('http://localhost:3000/api/prompt', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    }
  })
  const data = await response.json()
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
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Key</TableHead>
            <TableHead>Method</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {prompts?.map((prompt) => (
            <TableRow key={prompt.unique_key}>
              <TableCell className="font-medium">
                {prompt.unique_key}
                <br/>
                <span className="text-xs text-gray-500">{prompt.description}</span>
              </TableCell>
              <TableCell></TableCell>
              {/*<TableCell>{invoice.paymentMethod}</TableCell>*/}
              {/*<TableCell className="text-right">{invoice.totalAmount}</TableCell>*/}
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          {/*<TableRow>*/}
          {/*  <TableCell colSpan={3}>Total</TableCell>*/}
          {/*  <TableCell className="text-right">$2,500.00</TableCell>*/}
          {/*</TableRow>*/}
        </TableFooter>
      </Table>
    </div>
  )
}

export default Page
