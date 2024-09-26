'use client'
import {zodResolver} from "@hookform/resolvers/zod"
import {useFieldArray, useForm, Controller, Control} from "react-hook-form"
import {z} from "zod"

import {Button} from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {resourceFetcher} from "@/lib/api/fetcher";
import SkeletonCard from "@/components/custom-ui/skeleton-card";
import ErrorAlert from "@/components/custom-ui/error-alert";
import useSWR from "swr";
import {Card} from "@/components/ui/card";
import PromptVariant from "@/components/features/prompt-variant";
import {Textarea} from "@/components/ui/textarea";
import {Info} from "lucide-react";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import FieldLabelWrapper from "@/components/custom-ui/field-label-wrapper";
import {updateWebAuthnCredential} from "@/lib/auth/authAPIWrapper";
import {getCSRFToken} from "@/lib/auth/cookieUtils";
import {LoadingButton} from "@/components/ui-ext/loading-button";

const promptVariantSchema = z.object({
  name: z.string()
    .min(1, 'Please use an uppercase letter for variant name')
    .max(1, 'Please use an uppercase letter for variant name'),
  percentage: z.number().min(0).max(100),
  selected_version_uuid: z.string().uuid().optional(),
  segment_uuid: z.string().uuid().optional(),
  uuid: z.string().uuid().optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
  llm_model_name: z.string().optional(),
  versions: z.array(z.object({
    uuid: z.string().uuid().optional(),
    name: z.string()
      .min(4, 'Version Name must be at least 4 characters')
      .max(128, 'Version Name must be at most 128 characters'),
    content: z.string()
      .min(10, 'Prompt Content must be at least 4 characters')
      .max(100000, 'Prompt Content must be at most 1024 characters'),
    top_p: z.number().optional(),
    maximum_tokens: z.number().optional(),
    temperature: z.number().optional(),
    created_at: z.date().optional(),
    updated_at: z.date().optional(),
    deleted_at: z.date().optional(),
  })).optional(),
});


const promptWithVariantsVersionsSchema = z.object({
  uuid: z.string().uuid().optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
  unique_key: z.string()
    .regex(/^[a-z0-9_]+$/, 'Prompt Key must be lowercase alphanumeric')
    .min(4, 'Prompt Key must be at least 4 characters')
    .max(256, 'Prompt Key must be at most 256 characters')
  ,
  description: z.string().optional(),
  enabled: z.boolean().optional(),
});

export type PromptEditFormData = z.infer<typeof promptWithVariantsVersionsSchema> & {
  variants: z.infer<typeof promptVariantSchema>[];
};


// Separate component for rendering versions inside each variant
export const VersionsFieldArray = ({control, variantIndex}: {
  control: Control<PromptEditFormData>;
  variantIndex: number;
}) => {
  const {fields: versionFields, append: appendVersion} = useFieldArray({
    control,
    name: `variants.${variantIndex}.versions`,
  });

  return (
    <div>
      {versionFields.map((version, versionIndex) => (
        <div key={version.id}>
          <h4>Version {versionIndex + 1}</h4>

          <Controller
            name={`variants.${variantIndex}.versions.${versionIndex}.name`}
            control={control}
            render={
              ({field}) => <Input type="text" {...field} placeholder="Version Name"/>
            }
          />

          <Controller
            name={`variants.${variantIndex}.versions.${versionIndex}.content`}
            control={control}
            render={
              ({field}) => <Input type="textarea" {...field} placeholder="Content"/>
            }
          />
        </div>
      ))}

      <button type="button" onClick={() => appendVersion({name: "", content: ""})}>
        Add Version
      </button>
    </div>
  );
}

const PromptEdit = ({unique_key, description, enabled, variants, uuid, mutate}: PromptEditFormData & {mutate:(data)=>void}) => {

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


  const {reset, watch, control, handleSubmit, formState: {dirtyFields, isDirty, isSubmitted, isSubmitting, isSubmitSuccessful}} = form;

  // const watchAllFields = watch();

  const onUpdatePrompt = async (data: PromptEditFormData) => {
    console.log(data)

    const respData = await resourceFetcher(`prompt/${uuid}`, 'PUT',
      {
        ...data
      }
    )
    mutate({
      ...data,
      ...respData,
      variants: sorted_variants_versions,
    })
    console.log(respData)
    reset(data)
  }

  return (
    <>
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

                 <LoadingButton type="submit" className="ml-auto" loading={isSubmitting} disabled={!isDirty || isSubmitting}>
                   {
                      isSubmitting ? "Saving..." : "Save"
                   }
                  </LoadingButton>


                {/*<Button type="submit" className="ml-auto" disabled={!isDirty || isSubmitting}>*/}
                {/*  Save*/}

                {/*  {isSubmitting && <span className="ml-2">Saving...</span>}*/}
                {/*</Button>*/}
              </div>
            </fieldset>


            {/*<div className="flex-row flex gap-6">*/}
            {/*  {*/}
            {/*    variantFields.map((variantField, index) => {*/}
            {/*      return (*/}
            {/*        <div key={variantField.id} className="basis-1/2 flex flex-col border">*/}
            {/*          <FormField*/}
            {/*            control={control}*/}
            {/*            name={`variants.${index}.name`}*/}
            {/*            render={({field}) => (*/}
            {/*              <FormItem>*/}
            {/*                <FormLabel>Variant Name</FormLabel>*/}
            {/*                <FormControl>*/}
            {/*                  <Input placeholder="" {...field} />*/}
            {/*                </FormControl>*/}
            {/*                <FormDescription>*/}
            {/*                  Name of the variant.*/}
            {/*                </FormDescription>*/}
            {/*                <FormMessage/>*/}
            {/*              </FormItem>*/}
            {/*            )}*/}
            {/*          />*/}
            {/*          <FormField*/}
            {/*            control={control}*/}
            {/*            name={`variants.${index}.percentage`}*/}
            {/*            render={({field}) => (*/}
            {/*              <FormItem>*/}
            {/*                <FormLabel>Percentage</FormLabel>*/}
            {/*                <FormControl>*/}
            {/*                  <Input type="number" placeholder="" {...field} />*/}
            {/*                </FormControl>*/}
            {/*                <FormDescription>*/}
            {/*                  Percentage of the variant.*/}
            {/*                </FormDescription>*/}
            {/*                <FormMessage/>*/}
            {/*              </FormItem>*/}
            {/*            )}*/}
            {/*          />*/}

            {/*          <VersionsFieldArray*/}
            {/*            control={control}*/}
            {/*            variantIndex={index}*/}
            {/*            versions={variantField?.versions}*/}
            {/*          />*/}
            {/*        </div>*/}
            {/*      );*/}
            {/*    })*/}
            {/*  }*/}
            {/*</div>*/}
          </div>
        </form>
      </Form>
      <PromptVariant/>
    </>
  )
}

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
      <PromptEdit {...data} mutate={mutate}/>
    </>
  )
}


export default PromptDetail
