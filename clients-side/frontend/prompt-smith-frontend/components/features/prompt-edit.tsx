'use client'


import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
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

const promptSchema = z.object({
  prompt: z.object({
    unique_key: z.string()
      .regex(/^[a-z0-9_]+$/, 'Prompt Key must be lowercase alphanumeric')
      .min(4, 'Prompt Key must be at least 4 characters')
      .max(256, 'Prompt Key must be at most 256 characters')
    ,
    description: z.string().optional(),
    enabled: z.boolean().optional(),
  }),
  variants: z.array(z.object({
    name: z.string()
      .min(1, 'Please use an uppercase letter for variant name')
      .max(1, 'Please use an uppercase letter for variant name'),
    percentage: z.number().min(0).max(100),
    selected_version_uuid: z.string().uuid().optional(),
    segment_uuid: z.string().uuid().optional(),
  })),
  versions: z.array(z.object({
    name: z.string()
      .min(4, 'Version Name must be at least 4 characters')
      .max(128, 'Version Name must be at most 128 characters'),
    content: z.string()
      .min(10, 'Prompt Content must be at least 4 characters')
      .max(100000, 'Prompt Content must be at most 1024 characters'),
  })),
});

function PromptEdit() {
  // 1. Define your form.
  const form = useForm<z.infer<typeof promptSchema>>({
    resolver: zodResolver(promptSchema),
    defaultValues: {
      prompt: {},
      variants: [],
      versions: [],
    },
  })

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof promptSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex gap-4 flex-col md:flex-row">
          <div className="basis-full md:basis-1/3 flex flex-col gap-4">
            <div className="">
              <FormField
                control={form.control}
                name="prompt.unique_key"
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


            </div>


            <div className="">

              col2
            </div>
          </div>
          <div className="basis-full md:basis-2/3">
            prompt content
          </div>

          <Button type="submit">Submit</Button>

        </div>
      </form>
    </Form>


  )
}


export default PromptEdit
