'use client'
import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {Form, FormControl, FormField, FormItem, FormMessage,} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {resourceFetcher} from "@/lib/api/fetcher";
import PromptVariant from "@/components/features/prompt-variant";
import {Textarea} from "@/components/ui/textarea";
import FieldLabelWrapper from "@/components/custom-ui/field-label-wrapper";
import {LoadingButton} from "@/components/ui-ext/loading-button";
import {promptSchema} from "@/lib/api/schemas";
import {PromptFormData, VariantFormData} from "@/lib/api/interfaces";
import {useState} from "react";
import {Button} from "@/components/ui/button";


const PromptEdit = ({mutate, promptDetailData: data}: {
  promptDetailData: PromptFormData,
  mutate?: (data: PromptFormData) => Promise<void> | void
}) => {
  const {unique_key, description, enabled, variants: variantsDatas, uuid,} = data;

  const sorted_variants_with_sorted_versions = !variantsDatas?.length ? [
    {
      // no uuid, it means to create
      name: "A",
      percentage: 100,
      versions: []
    }
  ] : variantsDatas
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(variant => ({
      ...variant,
      versions: variant?.versions?.sort(
        (a, b) => (
          a.created_at && b.created_at && a.created_at < b.created_at ? 1 : -1
        )
      ).slice(0, 1)
    }));


  const [variants, setVariants] = useState<VariantFormData[]>(sorted_variants_with_sorted_versions)

  const addVariant = () => {
    if (variants.length >= 2) {
      return
    }
    const newVariant = {
      name: String.fromCharCode(65 + variants.length),
      percentage: 0,
      versions: []
    }
    setVariants([...variants, newVariant])
  }


  const [percentages, setPercentages] = useState<number[]>(sorted_variants_with_sorted_versions.map(variant => variant.percentage))

  // 1. Define your form.
  const form = useForm<PromptFormData>({
    resolver: zodResolver(promptSchema),
    defaultValues: {
      unique_key: unique_key,
      description: description,
      enabled: enabled,
      variants: sorted_variants_with_sorted_versions,
    },
  })


  const {
    reset,
    handleSubmit,
    formState: {isDirty, isSubmitting}
  } = form;

  const onPromptFormSubmit = async () => {
    const formData = form.getValues()
    let respData;
    if (!uuid) {
      respData = await resourceFetcher(`prompt`, 'POST',
        {
          ...formData
        }
      )
    } else {
      respData = await resourceFetcher(`prompt/${uuid}`, 'PUT',
        {
          ...formData
        }
      )

    }
    mutate && await mutate({
      ...formData, // form data
      ...respData, // updated data inject uuid, we should limit to direct fields only
      variants: sorted_variants_with_sorted_versions,
    })
    console.log(respData)
    reset(formData)
  }

  const onMutateVariant = async (variantIndex: number, variantData: VariantFormData) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    sorted_variants_with_sorted_versions[variantIndex] = variantData
    mutate && await mutate({
      ...data,
      variants: sorted_variants_with_sorted_versions
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <Form {...form}>
        <form onSubmit={handleSubmit(onPromptFormSubmit)} className="space-y-8">
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
        uuid && variants.slice(0, 2).map((variant, index) => {
          return (
            <PromptVariant
              key={variant.uuid}
              name={String.fromCharCode(65 + index)}
              variantData={variant}
              index={index}
              onMutateVariant={onMutateVariant}
              displayingPercentages={percentages}
              setDisplayingPercentages={setPercentages}
              promptUuid={uuid}
            />
          )
        })
      }
      <Button onClick={addVariant} disabled={variants.length >= 2 || !uuid}>Add Variant</Button>
    </div>
  )
}


export default PromptEdit
