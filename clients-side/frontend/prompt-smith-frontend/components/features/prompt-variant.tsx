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
                               variantData,
                               index,
                               name,
                               onMutateVariant,
                               displayingPercentages,
                               setDisplayingPercentages,
                               promptUuid

                             }: {
  variantData: VariantFormData,
  name: string,
  index: number,
  onMutateVariant: (index: number, data: VariantFormData) => Promise<void>,
  displayingPercentages: number[],
  setDisplayingPercentages: (percentages: number[]) => void,
  promptUuid: string
}) => {

  const variantForm = useForm<VariantFormData>({
    resolver: zodResolver(variantSchema),
    defaultValues: variantData,
  });

  const theSelectedVersion: VersionFormData = variantData?.versions?.length ? variantData?.versions[0] : {
    name: `${name}-${new Date().toISOString()}`,
    content: "",
  } as VersionFormData;

  const versionForm = useForm<VersionFormData>({
    resolver: zodResolver(versionSchema),
    defaultValues: theSelectedVersion,
  });

  const onVariantFormSubmit = async () => {
    //   get the data from the form
    const data = variantForm.getValues();
    if (!data.uuid) {
      // create variant
      const respData = await resourceFetcher(`prompt/${promptUuid}/variant`, 'POST',
        {
          ...data,
          name: name, // we use A and B for now
          versions: undefined,
        }
      )
      await onMutateVariant(index, respData);
      variantForm.reset(respData);
      return;
    }
    // update
    const respData = await resourceFetcher(`prompt/${promptUuid}/variant/${data.uuid}`, 'PUT',
      {
        ...data,
        name: name, // we use A and B for now
        versions: undefined,
      }
    )
    await onMutateVariant(index, respData);
    variantForm.reset(data);
  }


  const realTimePercentage = variantForm.watch('percentage');
  const onPercentageChange = async () => {
    await variantForm.trigger('percentage');
    setDisplayingPercentages(displayingPercentages.map((p, i) => i === index ? parseInt(`${realTimePercentage}`) : p));
  }


  const onVersionFormSubmit = async () => {
    if (!variantData?.uuid) {
      // init Variant A if it's not there, so we can have a variant to attach the version to
      await onVariantFormSubmit();
    }
    const variantUUID = variantForm.getValues().uuid;

    // get the data from the form
    const data = versionForm.getValues();
    console.log("submitting version", data);
    let respData: VersionFormData;
    if (!theSelectedVersion?.uuid) {
      // create version
      respData = await resourceFetcher(`prompt/${promptUuid}/${variantUUID}/version`, 'POST',
        {
          ...data,
        }
      )
    } else {
      respData = await resourceFetcher(`prompt/${promptUuid}/${variantUUID}/version/${theSelectedVersion?.uuid}`, 'PUT',
        {
          ...data,
        }
      )
    }
    await onMutateVariant(index, {
      ...variantForm.getValues(),
      versions: [{
        ...theSelectedVersion,
        ...respData
      }]
    });
    versionForm.reset(data);
  }

  const calculatedPercentage = !variantForm.formState.isDirty ?
    (realTimePercentage / displayingPercentages.reduce((a, b) => a + b, 0) * 100).toFixed(2) : '~';

  return (
    <div className="grid w-full grid-cols-12 items-start gap-4">
      <div className="col-span-12 row-span-4 h-full md:col-span-6 lg:col-span-8 xl:col-span-9">
        <Form {...versionForm}>
          <form className="h-full" onSubmit={
            (e) => {
              console.log("submitting version form triggered");
              console.log('version form state error', JSON.stringify(versionForm.formState.errors));
              versionForm.handleSubmit(onVersionFormSubmit)(e);
            }
          }>
            <fieldset className="h-full rounded-lg border p-4">
              <legend className="-ml-1 px-1 text-sm font-medium">
                {name} ({calculatedPercentage}%)
              </legend>
              <FormField
                control={versionForm.control}
                name="content"
                render={({field}) => (
                  <FormItem className="">
                    <FieldLabelWrapper
                      name={"Prompt Content"}
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
            console.log('varaint form error', JSON.stringify(variantForm.formState.errors));
            variantForm.handleSubmit(onVariantFormSubmit)(e);
          }}>
            <fieldset className="h-full rounded-lg border p-4">
              <legend className="-ml-1 px-1 text-sm font-medium">
                {name} Configuration
              </legend>
              <FormField
                control={variantForm.control}
                name="name"
                render={({field}) => (
                  <FormItem className="sr-only">
                    <FieldLabelWrapper name={"Variant Key"} description={"Variant key (A or B)"} required={true}/>
                    <FormControl>
                      <Input
                        type="hidden"
                        placeholder="A or B"
                        {...field}
                        value={name}
                      />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />
              <FormField
                control={variantForm.control}
                name="percentage"
                render={({field}) => (
                  <FormItem className="mt-2">
                    <FieldLabelWrapper name={"Rollout Weight"} description={"To match about this percentage of users. "}
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
