'use client'
import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {Form, FormControl, FormField, FormItem, FormMessage,} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {resourceFetcher} from "@/lib/api/fetcher";
import SkeletonCard from "@/components/custom-ui/skeleton-card";
import ErrorAlert from "@/components/custom-ui/error-alert";
import useSWR from "swr";
import PromptVariant from "@/components/features/prompt-variant";
import {Textarea} from "@/components/ui/textarea";
import FieldLabelWrapper from "@/components/custom-ui/field-label-wrapper";
import {LoadingButton} from "@/components/ui-ext/loading-button";
import {promptWithVariantsVersionsSchema} from "@/lib/api/schemas";
import {PromptEditFormData, PromptVariantFormData} from "@/lib/api/interfaces";


const PromptEdit = ({unique_key, description, enabled, variants, uuid, mutate}: PromptEditFormData & {
  mutate: (data:PromptEditFormData) => void
}) => {

  console.log('variants', variants)

  const sorted_variants_versions = variants
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(variant => ({
      ...variant,
      versions: variant?.versions?.sort((a, b) => {
        if (a.created_at === b.created_at) {
          return 0;
        } else if (a?.created_at && b?.created_at && a.created_at < b.created_at) {
          return 1;
        }
        return -1;
      }).slice(0, 1)
    }));


  // 1. Define your form.
  const form = useForm<PromptEditFormData>({
    resolver: zodResolver(promptWithVariantsVersionsSchema),
    defaultValues: {
      unique_key: unique_key,
      description: description,
      enabled: enabled,
      variants: sorted_variants_versions,
    },
  })


  const {
    reset,
    handleSubmit,
    formState: { isDirty, isSubmitting}
  } = form;

  const onUpdatePrompt = async (data: PromptEditFormData) => {
    const respData = await resourceFetcher(`prompt/${uuid}`, 'PUT',
      {
        ...data
      }
    )
    mutate({
      ...data, // form data
      ...respData, // updated data, we should limit to direct fields only
      variants: sorted_variants_versions,
    })
    console.log(respData)
    reset(data)
  }

  const onMutataVariant = (variantIndex:number, variantData: PromptVariantFormData) => {
    const updatedVariants = [...sorted_variants_versions];
    updatedVariants[variantIndex] = variantData
    mutate({
      ...form.getValues(),
      variants: updatedVariants
    })
  }


  return (
    <div className="flex flex-col gap-4">
      <Form {...form}>
        <form onSubmit={handleSubmit(onUpdatePrompt)} className="space-y-8">
          <div className="flex flex-col">
            <fieldset className="rounded-lg border p-4 w-full">
              <legend className="-ml-1 px-1 text-sm font-medium">
                Prompt Configuration
              </legend>
              <FormField
                control={form.control}
                name="unique_key"
                render={({field}) => (
                  <FormItem>
                    <FieldLabelWrapper name={"Prompt"} description={"Unique key for the prompt."} required={true}/>
                    <FormControl>
                      <Input placeholder="" {...field} />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({field}) => (
                  <FormItem className={"mt-4"}>
                    <FieldLabelWrapper name={"Description"} description={"Description of the prompt."}
                                       required={false}/>
                    <FormControl>
                      <Textarea
                        id="description"
                        className="min-h-[4rem]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />
              <div className="w-full mt-3 flex">

                <LoadingButton type="submit" className="ml-auto" loading={isSubmitting}
                               disabled={!isDirty || isSubmitting}>
                  {
                    isSubmitting ? "Saving..." : "Save"
                  }
                </LoadingButton>
              </div>
            </fieldset>



          </div>
        </form>
      </Form>
      {
        sorted_variants_versions.slice(0,2).map((variant, index) => {
          return (
            <PromptVariant key={variant.uuid} data={variant} index={index} onMutate={onMutataVariant}/>
          )
        })
      }
    </div>
  )
}

const PromptDetail = ({uuid}: { uuid: string }) => {

  // fetch prompt data from api and use as default values todo
  const {data, error, isLoading, mutate} = useSWR(`prompt/${uuid}/detail`, resourceFetcher)

  console.log('data', data)

  if (isLoading) {
    return <SkeletonCard/>
  }

  if (error) {
    return <ErrorAlert open={!!error}/>
  }

  return (
    <>
      <PromptEdit {...data} mutate={mutate}/>
    </>
  )
}


export default PromptDetail
