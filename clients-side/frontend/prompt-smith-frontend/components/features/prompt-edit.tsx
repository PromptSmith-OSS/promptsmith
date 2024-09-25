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

const promptSchema = z.object({

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
  variants: z.array(z.object({
    name: z.string()
      .min(1, 'Please use an uppercase letter for variant name')
      .max(1, 'Please use an uppercase letter for variant name'),
    percentage: z.number().min(0).max(100),
    selected_version_uuid: z.string().uuid().optional(),
    segment_uuid: z.string().uuid().optional(),
    uuid: z.string().uuid().optional(),
    versions: z.array(z.object({
      uuid: z.string().uuid().optional(),
      name: z.string()
        .min(4, 'Version Name must be at least 4 characters')
        .max(128, 'Version Name must be at most 128 characters'),
      content: z.string()
        .min(10, 'Prompt Content must be at least 4 characters')
        .max(100000, 'Prompt Content must be at most 1024 characters'),
    })),
  })),
});

type PromptEditFormData = z.infer<typeof promptSchema>;


// Separate component for rendering versions inside each variant
const VersionsFieldArray = ({control, variantIndex}: {
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
            render={({field}) => <input {...field} placeholder="Version Name"/>}
          />

          <Controller
            name={`variants.${variantIndex}.versions.${versionIndex}.content`}
            control={control}
            render={({field}) => <textarea {...field} placeholder="Content"/>}
          />
        </div>
      ))}

      <button type="button" onClick={() => appendVersion({name: "", content: ""})}>
        Add Version
      </button>
    </div>
  );
}

const PromptEdit = ({unique_key, description, enabled, variants}: PromptEditFormData) => {

  // 1. Define your form.
  const form = useForm<PromptEditFormData>({
    resolver: zodResolver(promptSchema),
    defaultValues: {
      unique_key: unique_key,
      description: description,
      enabled: enabled,
      variants: variants,
    },
  })


  const {control, handleSubmit} = form;

  const {
    fields: variantFields,
    append: appendVariant,
    remove: removeVariant,
  } = useFieldArray({
    control,
    name: "variants", // Manage the variants array
  });


  // 2. Define a submit handler.
  function onSubmit(values: PromptEditFormData) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <div className="flex gap-4 flex-col">
            <div className="">
              <Card className="">
                <FormField
                  control={form.control}
                  name="unique_key"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Prompt Key</FormLabel>
                      <FormControl>
                        <Input placeholder="" {...field} />
                      </FormControl>
                      <FormDescription>
                        Unique key for the prompt.
                      </FormDescription>
                      <FormMessage/>
                    </FormItem>
                  )}
                />

                {/*  description field */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input placeholder="" {...field} />
                      </FormControl>
                      <FormDescription>
                        Description of the prompt.
                      </FormDescription>
                      <FormMessage/>
                    </FormItem>
                  )}
                />
              </Card>

            </div>
            <div className="flex-row flex gap-6">
              {/*  variants field with list of options */}
              {
                variantFields.map((field, index) => {
                  return (
                    <div key={field.id} className="basis-1/2 flex flex-col border">
                      <FormField
                        control={control}
                        name={`variants.${index}.name`}
                        render={({field}) => (
                          <FormItem>
                            <FormLabel>Variant Name</FormLabel>
                            <FormControl>
                              <Input placeholder="" {...field} />
                            </FormControl>
                            <FormDescription>
                              Name of the variant.
                            </FormDescription>
                            <FormMessage/>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={control}
                        name={`variants.${index}.percentage`}
                        render={({field}) => (
                          <FormItem>
                            <FormLabel>Percentage</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="" {...field} />
                            </FormControl>
                            <FormDescription>
                              Percentage of the variant.
                            </FormDescription>
                            <FormMessage/>
                          </FormItem>
                        )}
                      />

                      <VersionsFieldArray
                        control={control}
                        variantIndex={index}
                        versions={field.versions}
                      />
                    </div>
                  );
                })
              }
            </div>

          </div>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Form>
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

  console.log(data)

  return (
    <PromptEdit {...data}/>
  )
}


export default PromptDetail
