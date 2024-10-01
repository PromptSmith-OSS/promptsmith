'use client'
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {usePaginatedSWR} from "@/lib/hooks/paginatedSWR";
import {resourceFetcher} from "@/lib/api/fetcher";
import SkeletonCard from "@/components/custom-ui/skeleton-card";
import ErrorAlert from "@/components/custom-ui/error-alert";
import {PublicKeyData} from "@/lib/api/interfaces";
import {formatRelativeTime} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {LoadingButton} from "@/components/ui-ext/loading-button";
import {Copy} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {useToast} from "@/hooks/use-toast"


const KeyTable = () => {
  const {toast} = useToast()

  const {data, error, isLoading, mutate} = usePaginatedSWR('key', resourceFetcher)


  if (isLoading) {
    return <SkeletonCard/>
  }

  if (error) {
    return <ErrorAlert open={!!error}/>
  }


  const keys: PublicKeyData[] = data?.items || [];


  const initilizeNewKey = async () => {
    console.log('initilizeNewKey')
    const resp = await resourceFetcher('key', 'POST', {});
    console.log(resp)
    mutate(
      {
        ...data,
        resp,
      }
    )
  }


  return (
    <>
      <div className="flex flex-row w-full justify-between pb-2 mb-2">
        <div></div>
        <Button variant="default" size="default" className="flex items-center justify-center" onClick={initilizeNewKey}>
          Initialize a new API Key
        </Button>
      </div>
      <Table>
        <TableCaption>API Keys to be used in SDK.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Key</TableHead>
            <TableHead className="text-right">Created</TableHead>
            <TableHead className="text-right w-8 "></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {
            keys.map((key) => (
              <TableRow key={key.uuid}>
                <TableCell className="flex flex-row gap-2 items-center ">
                  <div className="max-w-20 md:max-w-40  lg:max-w-80  truncate text-ellipsis overflow-hidden">
                    {key.key}
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Button variant="outline" size="sm" onClick={async () => {
                          await navigator.clipboard.writeText(key?.key || '');
                          toast({
                            title: "API Key Copied",
                            description: key?.key?.slice(0, 20) + '...',
                            duration: 1000,
                          })
                        }}>
                          <Copy/>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Copy the API Key</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell className="text-right">
                  {key?.created_at ? formatRelativeTime(key.created_at) : 'N/A'}
                </TableCell>
                <TableHead className="text-right w-5 ">
                  <LoadingButton variant={"outline"}>Delete</LoadingButton>
                </TableHead>
              </TableRow>
            ))
          }

        </TableBody>
      </Table>
    </>
  )
}

export default KeyTable;
