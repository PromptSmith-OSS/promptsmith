import {Bird, Rabbit, Turtle,} from "lucide-react"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select"
import {Textarea} from "@/components/ui/textarea"
import {PromptVariantFormData, PromptVersionFormData} from "@/lib/api/interfaces";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {promptVariantSchema, promptVersionSchema} from "@/lib/api/schemas";
import {Form} from "@/components/ui/form";


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


  const {name, percentage, versions} = data;

  const onUpdateVariant = async (data: PromptVariantFormData) => {

  }

  const onUpdateVersionContent = async (index: number, data: PromptVariantFormData) => {

  }

  return (
    <div className="grid w-full grid-cols-12 items-start gap-4">
      <div className="col-span-12 md:col-span-6 lg:col-span-8 xl:col-span-9">
        <Form {...variantForm}>
          <form className="">
            <fieldset className="rounded-lg border p-4 ">
              <legend className="-ml-1 px-1 text-sm font-medium">
                {variantName}
              </legend>
              <div className="grid gap-3">
                <Label htmlFor="content">Prompt Content</Label>
                <Textarea
                  id="content"
                  placeholder="You are a..."
                  className="min-h-[10em]"
                />
              </div>
            </fieldset>
          </form>
        </Form>
      </div>
      <div className={"col-span-12  md:col-span-6 lg:col-span-4 xl:col-span-3"}>
        <Form {...variantForm}>
          <form className="">
            <fieldset className="rounded-lg border p-4">
              <legend className="-ml-1 px-1 text-sm font-medium">
                {variantName} Configuration
              </legend>
              <div className="grid gap-3">
                <Label htmlFor="model">Model</Label>
                <Select>
                  <SelectTrigger
                    id="model"
                    className="items-start [&_[data-description]]:hidden"
                  >
                    <SelectValue placeholder="Select a model"/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="genesis">
                      <div className="flex items-start gap-3 text-muted-foreground">
                        <Rabbit className="size-5"/>
                        <div className="grid gap-0.5">
                          <p>
                            Neural{" "}
                            <span className="font-medium text-foreground">
                                Genesis
                              </span>
                          </p>
                          <p className="text-xs" data-description>
                            Our fastest model for general use cases.
                          </p>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="explorer">
                      <div className="flex items-start gap-3 text-muted-foreground">
                        <Bird className="size-5"/>
                        <div className="grid gap-0.5">
                          <p>
                            Neural{" "}
                            <span className="font-medium text-foreground">
                                Explorer
                              </span>
                          </p>
                          <p className="text-xs" data-description>
                            Performance and speed for efficiency.
                          </p>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="quantum">
                      <div className="flex items-start gap-3 text-muted-foreground">
                        <Turtle className="size-5"/>
                        <div className="grid gap-0.5">
                          <p>
                            Neural{" "}
                            <span className="font-medium text-foreground">
                                Quantum
                              </span>
                          </p>
                          <p className="text-xs" data-description>
                            The most powerful model for complex computations.
                          </p>
                        </div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="temperature">Temperature</Label>
                <Input id="temperature" type="number" placeholder="0.4"/>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-3">
                  <Label htmlFor="top-p">Top P</Label>
                  <Input id="top-p" type="number" placeholder="0.7"/>
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="top-k">Top K</Label>
                  <Input id="top-k" type="number" placeholder="0.0"/>
                </div>
              </div>
            </fieldset>

          </form>
        </Form>
      </div>
    </div>
  )
}

export default PromptVariantEditor
