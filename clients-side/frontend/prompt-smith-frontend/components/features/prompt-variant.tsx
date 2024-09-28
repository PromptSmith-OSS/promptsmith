import {Input} from "@/components/ui/input"
import {Textarea} from "@/components/ui/textarea"
import {VariantFormData, VersionFormData} from "@/lib/api/interfaces";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {variantSchema, versionSchema} from "@/lib/api/schemas";
import {Form, FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form";
import FieldLabelWrapper from "@/components/custom-ui/field-label-wrapper";
import {LoadingButton} from "@/components/ui-ext/loading-button";
import {resourceFetcher} from "@/lib/api/fetcher";

const PromptVariantEditor = ({
                               data,
                               index,
                               name,
                               onMutate,
                               percentages,
                               setPercentages,
                               promptUuid

                             }: {
  data: VariantFormData,
  name: string,
  index: number,
  onMutate: (index: number, data: VariantFormData) => void,
  percentages: number[],
  setPercentages: (percentages: number[]) => void,
  promptUuid: string
}) => {
  const variantForm = useForm<VariantFormData>({
    resolver: zodResolver(variantSchema),
    defaultValues: data,
  });

  const versionForm = useForm<VersionFormData>({
    resolver: zodResolver(versionSchema),
    defaultValues: data?.versions?.length ? data?.versions[0] : {},
  });

  const onVariantFormSubmit = async () => {
    //   get the data from the form
    console.log("Submitting variant form");
    const data = variantForm.getValues();
    const respData = await resourceFetcher(`prompt/${promptUuid}/variant/${data.uuid}`, 'PUT',
      {
        ...data,
        versions: undefined,
      }
    )
    console.log(respData);
    onMutate(index, data);
  }


  const realTimePercentage = variantForm.watch('percentage');
  const onPercentageChange = () => {
    variantForm.trigger('percentage');
    setPercentages(percentages.map((p, i) => i === index ? parseInt(`${realTimePercentage}`) : p));
  }


  const onVersionFormSubmit = async () => {
    // get the data from the form

  }

  const calculatedPercentage = realTimePercentage / percentages.reduce((a, b) => a + b, 0) * 100;

  return (
    <div className="grid w-full grid-cols-12 items-start gap-4">
      <div className="col-span-12 row-span-4 h-full md:col-span-6 lg:col-span-8 xl:col-span-9">
        <Form {...versionForm}>
          <form className="h-full" onSubmit={versionForm.handleSubmit(onVersionFormSubmit)}>
            <fieldset className="rounded-lg border p-4 h-full">
              <legend className="-ml-1 px-1 text-sm font-medium">
                {name} - {calculatedPercentage.toFixed(2)}%
              </legend>
              <FormField
                control={versionForm.control}
                name="content"
                render={({field}) => (
                  <FormItem className="">
                    <FieldLabelWrapper name={"Prompt Content"}
                                       description={"Prompt Content. "}
                                       required={true}
                    />
                    <FormControl>
                      <Textarea
                        id="content"
                        placeholder="You are a..."
                        className="min-h-[10em]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />

              <div className="mt-3 flex w-full">
                <LoadingButton
                  type="submit"
                  className="ml-auto"
                  loading={versionForm.formState.isSubmitting}
                  disabled={!versionForm.formState.isDirty || versionForm.formState.isSubmitting}
                >
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
          <form className="h-full" onSubmit={(e) => {
            console.log("Form submit triggered", e);
            console.log(variantForm.formState, variantForm.formState.errors);
            variantForm.handleSubmit(onVariantFormSubmit)(e);
          }}>
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
                    <FormControl>
                      <Input type="number"
                             placeholder={"0 - 100"}
                             {...field}
                             onBlur={onPercentageChange}
                      />
                    </FormControl>
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
