'use client'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {useState} from "react";
import useSWR from 'swr'


import {Prompt} from "@/lib/api/interfaces";
import {resourceFetcher} from "@/lib/api/fetcher";


function PromptComponent() {
  const [pageIndex, setPageIndex] = useState(0);

  const {data, error, isLoading} = useSWR(`prompt?page=${pageIndex}`, resourceFetcher)


  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error loading prompts</div>
  }

  const prompts = data.items as Prompt[]


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
            <TableRow key={prompt?.unique_key}>
              <TableCell className="font-medium">
                {prompt?.unique_key}
                <br/>
                <span className="text-xs text-gray-500">{prompt?.description}</span>
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

export default PromptComponent
