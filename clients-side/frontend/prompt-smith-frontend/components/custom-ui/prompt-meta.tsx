import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Bird, Rabbit, Turtle} from "lucide-react";
import {Input} from "@/components/ui/input";

const PromptMeta = () => {
  return (
    <fieldset className="col-span-12 rounded-lg border p-4 md:col-span-6 lg:col-span-4 xl:col-span-3">
      <legend className="-ml-1 px-1 text-sm font-medium">
        Configuration
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
  )
}

export default PromptMeta
