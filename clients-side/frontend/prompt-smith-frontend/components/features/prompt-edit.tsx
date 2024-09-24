'use client'
import {zodResolver} from "@hookform/resolvers/zod"
import {useFieldArray, useForm} from "react-hook-form"
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
  })),
  versions: z.array(z.object({
    uuid: z.string().uuid().optional(),
    name: z.string()
      .min(4, 'Version Name must be at least 4 characters')
      .max(128, 'Version Name must be at most 128 characters'),
    content: z.string()
      .min(10, 'Prompt Content must be at least 4 characters')
      .max(100000, 'Prompt Content must be at most 1024 characters'),
  })),

});

type PromptEditFormData = z.infer<typeof promptSchema>;

function PromptEdit({unique_key, description, enabled, variants, versions}: PromptEditFormData) {

  // 1. Define your form.
  const form = useForm<PromptEditFormData>({
    resolver: zodResolver(promptSchema),
    defaultValues: {
      unique_key: unique_key,
      description: description,
      enabled: enabled,
      variants: variants,
      versions: versions,
    },
  })


  const {control} = form;

  const {
    fields: variantFields,
    append: appendVariant,
    remove: removeVariant,
  } = useFieldArray({
    control,
    name: "variants", // Manage the variants array
  });

  const {
    fields: versionFields,
    append: appendVersion,
    remove: removeVersion,
  } = useFieldArray({
    control,
    name: "versions", // Manage the versions array
  });


  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof promptSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <div className="flex gap-4 flex-col md:flex-row">
            <div className="basis-full md:basis-1/3 flex flex-col gap-4">
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


              <div className="border">
                {/*  variants field with list of options */}
                {
                  variantFields.map((field, index) => {
                    return (
                      <div key={field.id}>
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
                      </div>
                    );
                  })
                }
              </div>
            </div>
            <div className="basis-full md:basis-2/3">
              {versionFields.map((field, index) => {
                return (
                  <div key={field.id}>
                    <FormField
                      control={control}
                      name={`versions.${index}.name`}
                      render={({field}) => (
                        <FormItem>
                          <FormLabel>Version Name</FormLabel>
                          <FormControl>
                            <Input placeholder="" {...field} />
                          </FormControl>
                          <FormDescription>
                            Name of the version.
                          </FormDescription>
                          <FormMessage/>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name={`versions.${index}.content`}
                      render={({field}) => (
                        <FormItem>
                          <FormLabel>Content</FormLabel>
                          <FormControl>
                            <Input placeholder="" {...field} />
                          </FormControl>
                          <FormDescription>
                            Content of the version.
                          </FormDescription>
                          <FormMessage/>
                        </FormItem>
                      )}
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
