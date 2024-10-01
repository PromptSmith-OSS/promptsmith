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
import {resourceFetcher} from "@/lib/api/fetcher";
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
import Link from "next/link";
import ErrorAlert from "@/components/custom-ui/error-alert";
import {usePaginatedSWR} from "@/lib/hooks/paginatedSWR";


function PromptTable() {
  const {data, error, isLoading, pagination, mutate} = usePaginatedSWR('prompt', resourceFetcher)
  const disablePrompt = async (uuid: string) => {
    await resourceFetcher(`prompt/${uuid}`, 'PUT', {
      enabled: false
    })
    await mutate(
      {
        ...data,
        enabled: false
      }
    )
  }

  const enablePrompt = async (uuid: string) => {
    await resourceFetcher(`prompt/${uuid}`, 'PUT', {
      enabled: true
    })
    await mutate(
      {
        ...data,
        enabled: true
      }
    )
  }


  if (isLoading) {
    return <SkeletonCard/>
  }

  if (error) {
    return <ErrorAlert open={!!error}/>
  }

  // sort by unique_key
  const prompts = data?.items.sort(
    (a: Prompt, b: Prompt) => a.unique_key.localeCompare(b.unique_key)
  ) as Prompt[]


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
                  {
                    prompt?.enabled && <>
                      <Link href={`/prompt/${prompt?.uuid}`}>
                        <DropdownMenuItem>
                          Edit
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuSeparator/>
                    </>
                  }
                  <DropdownMenuItem
                    onClick={
                      async () => {
                        console.log('Disable')
                        if (prompt?.uuid) {
                          if (prompt?.enabled) {
                            await disablePrompt(prompt.uuid)
                          } else {
                            await enablePrompt(prompt.uuid)
                          }
                        }
                      }
                    }
                  >
                    {
                      prompt?.enabled
                        ? 'Disable'
                        : 'Enable'
                    }
                  </DropdownMenuItem>
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

export default PromptTable
