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
import Link from "next/link";


const KeyTable = () => {
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
            <TableHead className="text-right w-5 "></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {
            keys.map((key) => (
              <TableRow key={key.uuid}>
                <TableCell className="w-40 max-w-40 truncate text-ellipsis overflow-hidden">
                  {key.key}
                                    <Button>Copy</Button>
                </TableCell>
                <TableCell className="text-right">
                  {key?.created_at ? formatRelativeTime(key.created_at) : 'N/A'}
                </TableCell>
                <TableHead className="text-right w-5 ">

                  <LoadingButton>Delete</LoadingButton>
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
