import {z} from "zod";
import {promptVariantSchema, promptVersionSchema, promptWithVariantsVersionsSchema} from "@/lib/api/schemas";

export type Organization = {
  name: string
  description: string
  uuid: string
}
export type Project = {
  name: string
  description: string
  uuid: string
}


export type UserResp = {
  data: {
    user: {
      email: string
      username: string
      display: string
    },
    methods: [
      {
        method: string
        at: number
        email: string
      }
    ]
  },
  meta: {
    is_authenticated: boolean
  }
}

export type PromptVersionFormData = z.infer<typeof promptVersionSchema>;


export type PromptVariantFormData = z.infer<typeof promptVariantSchema> & {
  versions?: PromptVersionFormData[]
};


export type PromptEditFormData = z.infer<typeof promptWithVariantsVersionsSchema> & {
  variants?: PromptVariantFormData[];
};

export type Prompt = PromptEditFormData




