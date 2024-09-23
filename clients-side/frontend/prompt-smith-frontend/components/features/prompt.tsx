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


import {Prompt} from "@/lib/api/interfaces";
import {resourceFetcher, usePaginatedSWR} from "@/lib/api/fetcher";
import {formatRelativeTime} from "@/lib/utils";
import {Badge} from "@/components/ui/badge";
import {Ellipsis} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import SkeletonCard from "@/components/custom-ui/skeleton-card";


function PromptComponent() {
  const {data, error, isLoading, pagination} = usePaginatedSWR('prompt', resourceFetcher)
  if (isLoading) {
    return <SkeletonCard/>
  }

  if (error) {
    return <div>Error loading prompts</div>
  }

  const prompts = data?.items as Prompt[]


  return (
      <Table>
        <TableCaption>A list of your AI prompts.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Key</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Created</TableHead>
          <TableHead className="text-right w-5 "></TableHead>
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
            <TableCell>
              {prompt?.enabled ?
                <Badge variant="default">Enabled</Badge> : <Badge variant="secondary">Disabled</Badge>}
            </TableCell>
            <TableCell className="text-right">
              {prompt?.created_at ? formatRelativeTime(prompt?.created_at) : 'N/A'}
            </TableCell>
            <TableCell className="p-2">
              <DropdownMenu>
                <DropdownMenuTrigger><Ellipsis/></DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuSeparator/>
                  <DropdownMenuItem>Disable</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
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
  )
}

export default PromptComponent
