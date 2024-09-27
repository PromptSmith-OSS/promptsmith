import {z} from "zod";
import {promptVariantSchema, versionSchema, variantSchema} from "@/lib/api/schemas";

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

export type VersionFormData = z.infer<typeof versionSchema>;


export type VariantFormData = z.infer<typeof promptVariantSchema> & {
  versions?: VersionFormData[]
};


export type PromptFormData = z.infer<typeof variantSchema> & {
  variants?: VariantFormData[];
};

export type Prompt = PromptFormData




