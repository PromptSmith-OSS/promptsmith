import PromptPage from "@/components/features/prompt";


export async function Page() {
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
