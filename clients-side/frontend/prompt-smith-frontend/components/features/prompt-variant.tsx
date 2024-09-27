import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Textarea} from "@/components/ui/textarea"
import {VariantFormData, VersionFormData} from "@/lib/api/interfaces";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {promptVariantSchema, versionSchema} from "@/lib/api/schemas";
import {Form, FormField, FormItem, FormMessage} from "@/components/ui/form";
import FieldLabelWrapper from "@/components/custom-ui/field-label-wrapper";
import {LoadingButton} from "@/components/ui-ext/loading-button";

const PromptVariantEditor = ({
                               data,
                               index,
                               name,
                               onMutate,
                               percentages,
                               setPercentages,
                             }: {
  data: VariantFormData,
  name: string,
  index: number,
  onMutate: (index: number, data: VariantFormData) => void,
  percentages: number[],
  setPercentages: (percentages: number[]) => void,
}) => {

  const variantForm = useForm<VariantFormData>({
    resolver: zodResolver(promptVariantSchema),
    defaultValues: data,
  });

  const versionForm = useForm<VersionFormData>({
    resolver: zodResolver(versionSchema),
    defaultValues: data?.versions?.length ? data?.versions[0] : {},
  });

  const onUpdateVariant = async () => {
    //   get the data from the form
  }


  const realTimePercentage = variantForm.watch('percentage');
  const onPercentageChange = () => {
    variantForm.trigger('percentage');
    console.log('realTimePercentage', realTimePercentage, percentages);
    setPercentages(percentages.map((p, i) => i === index ? parseInt(`${realTimePercentage}`) : p));
    console.log('percentages', percentages);
  }


  const onUpdateVersionContent = async () => {
    // get the data from the form

  }

  const calculatedPercentage = realTimePercentage / percentages.reduce((a, b) => a + b, 0) * 100;

  return (
    <div className="grid w-full grid-cols-12 items-start gap-4">
      <div className="col-span-12 row-span-4 h-full md:col-span-6 lg:col-span-8 xl:col-span-9">
        <Form {...versionForm}>
          <form className="h-full" onSubmit={versionForm.handleSubmit(onUpdateVariant)}>
            <fieldset className="rounded-lg border p-4 h-full">
              <legend className="-ml-1 px-1 text-sm font-medium">
                {name} - {calculatedPercentage.toFixed(2)}%
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
                {name} Configuration
              </legend>
              <FormField
                control={variantForm.control}
                name="percentage"
                render={({field}) => (
                  <FormItem className="mt-2">
                    <FieldLabelWrapper name={"Rollout"} description={"To match about this percentage of users. "}
                                       required={true}/>
                    <Input type="number"
                           placeholder={"0 - 100"}
                           {...field}
                           onBlur={onPercentageChange}
                    />
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
