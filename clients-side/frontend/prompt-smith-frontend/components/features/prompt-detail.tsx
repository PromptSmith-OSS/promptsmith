'use client'
import useSWR from "swr";
import {resourceFetcher} from "@/lib/api/fetcher";
import SkeletonCard from "@/components/custom-ui/skeleton-card";
import ErrorAlert from "@/components/custom-ui/error-alert";
import PromptEdit from "@/components/features/prompt-edit";
import CodeSnippetTabs from "@/components/custom-ui/code-snippet-tabs";

const PromptDetail = ({uuid}: { uuid: string }) => {
  // fetch prompt data from api and use as default values todo
  const {data, error, isLoading, mutate} = useSWR(`prompt/${uuid}/detail`, resourceFetcher)
  if (isLoading) {
    return <SkeletonCard/>
  }

  if (error) {
    return <ErrorAlert open={!!error}/>
  }

  return (
    <>
      <PromptEdit promptDetailData={data} mutate={mutate}/>
      <hr/>
      <CodeSnippetTabs prompt_key={data.unique_key}/>
    </>
  )
}
export default PromptDetail;
