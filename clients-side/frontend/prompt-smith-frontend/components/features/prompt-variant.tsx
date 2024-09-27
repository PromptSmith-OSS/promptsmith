import {Bird, Rabbit, Turtle,} from "lucide-react"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select"
import {Textarea} from "@/components/ui/textarea"
import {PromptVariantFormData, PromptVersionFormData} from "@/lib/api/interfaces";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {promptVariantSchema, promptVersionSchema} from "@/lib/api/schemas";
import {Form, FormField, FormItem, FormMessage} from "@/components/ui/form";
import FieldLabelWrapper from "@/components/custom-ui/field-label-wrapper";
import {LoadingButton} from "@/components/ui-ext/loading-button";


export const description =
  "An AI playground with a sidebar navigation and a main content area. The playground has a header with a settings drawer and a share button. The sidebar has navigation links and a user menu. The main content area shows a form to configure the model and messages."

const PromptVariantEditor = ({data}: {
  data: PromptVariantFormData,
  index: number,
  onMutate: (index: number, data: PromptVariantFormData) => void
}) => {

  const variantForm = useForm<PromptVariantFormData>({
    resolver: zodResolver(promptVariantSchema),
    defaultValues: data,
  });

  const versionForm = useForm<PromptVersionFormData>({
    resolver: zodResolver(promptVersionSchema),
    defaultValues: data?.versions[0] || {},
  });

  const variantName = variantForm.watch('name');

  const onUpdateVariant = async () => {
  //   get the data from the form

  }

  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    variantForm.trigger('name');
  }

  const onUpdateVersionContent = async () => {
    // get the data from the form

  }

  return (
    <div className="grid w-full grid-cols-12 items-start gap-4">
      <div className="col-span-12 row-span-4 h-full md:col-span-6 lg:col-span-8 xl:col-span-9">
        <Form {...versionForm}>
          <form className="h-full" onSubmit={versionForm.handleSubmit(onUpdateVariant)}>
            <fieldset className="rounded-lg border p-4 h-full">
              <legend className="-ml-1 px-1 text-sm font-medium">
                {variantName}
              </legend>
              <FormField
                control={versionForm.control}
                name="content"
                render={({field}) => (
                  <FormItem className="">
                    <Label htmlFor="content">Prompt Content</Label>
                    <Textarea
                      id="content"
                      placeholder="You are a..."
                      className="min-h-[10em]"
                      {...field}
                    />
                                        <FormMessage/>
                  </FormItem>
                )}
              />

              <div className="mt-3 flex w-full">
                <LoadingButton type="submit" className="ml-auto" loading={versionForm.formState.isSubmitting}
                               disabled={!versionForm.formState.isDirty || versionForm.formState.isSubmitting}>
                  {
                    versionForm.formState.isSubmitting ? "Saving..." : "Save"
                  }
                </LoadingButton>
              </div>
            </fieldset>
          </form>
        </Form>
      </div>
      <div className="col-span-12 row-span-4 h-full md:col-span-6 lg:col-span-4 xl:col-span-3">
        <Form {...variantForm}>
          <form className="h-full">
            <fieldset className="rounded-lg border p-4 h-full">
              <legend className="-ml-1 px-1 text-sm font-medium">
                {variantName} Configuration
              </legend>
              <FormField
                control={variantForm.control}
                name="name"
                render={({field}) => (
                  <FormItem>
                    <FieldLabelWrapper name={"Variant Key"} description={"Variant key (A or B)"} required={true}/>
                    <Input
                      placeholder="A or B"
                      {...field}
                      onBlur={onNameChange}
                    />
                                        <FormMessage/>
                  </FormItem>
                )}
              />
              <FormField
                control={variantForm.control}
                name="percentage"
                render={({field}) => (
                  <FormItem className="mt-2">
                    <FieldLabelWrapper name={"Rollout"} description={"To match about this percentage of users. "}
                                       required={true}/>
                    <Input type="number" placeholder="0 - 100" {...field}/>
                                        <FormMessage/>
                  </FormItem>
                )}
              />
              <div className="mt-3 flex w-full">
                <LoadingButton type="submit" className="ml-auto" loading={variantForm.formState.isSubmitting}
                               disabled={!variantForm.formState.isDirty || variantForm.formState.isSubmitting}>
                  {
                    variantForm.formState.isSubmitting ? "Saving..." : "Save"
                  }
                </LoadingButton>
              </div>
            </fieldset>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default PromptVariantEditor
