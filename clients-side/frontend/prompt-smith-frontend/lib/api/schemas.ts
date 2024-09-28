import {z} from "zod";

export const promptSchema = z.object({
  uuid: z.string().uuid().optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
  unique_key: z.string()
    .regex(/^[a-z0-9_]+$/, 'Prompt Key must be lowercase alphanumeric')
    .min(4, 'Prompt Key must be at least 4 characters')
    .max(256, 'Prompt Key must be at most 256 characters')
  ,
  description: z.string()
    .min(4, 'Description must be at least 4 characters')
    .max(1024, 'Description must be at most 1024 characters')
    .optional(),
  enabled: z.boolean().optional(),
});

export const versionSchema = z.object({
    uuid: z.string().uuid().optional(),
    name: z.string()
      .min(4, 'Version Name must be at least 4 characters')
      .max(128, 'Version Name must be at most 128 characters'),
    content: z.string()
      .min(10, 'Prompt Content must be at least 4 characters')
      .max(100000, 'Prompt Content must be at most 1024 characters'),
    top_p: z.number().optional(),
    maximum_tokens: z.number().optional(),
    temperature: z.number().optional(),
    created_at: z.date().optional(),
    updated_at: z.date().optional(),
    deleted_at: z.date().optional(),
  }
);

export const variantSchema = z.object({
  name: z.string()
    .regex(/^[A-Z]$/, 'Please use A or B for variant key')
    .min(1, 'Please use 1 uppercase letter for variant name')
    .max(1, 'Please use 1 uppercase letter for variant name'),
  percentage: z.coerce.number().int()
    .min(0, 'Rollout Percentage should be at least 0')
    .max(100, 'Rollout Percentage should be at most 100'),
  selected_version_uuid: z.string().uuid().optional().nullable(),
  segment_uuid: z.string().uuid().optional().nullable(),
  uuid: z.string().uuid().optional().nullable(),
  created_at: z.string()
    .refine((val) => !isNaN(Date.parse(val)), {message: "Invalid date string"}) // Validate date string
    .transform((val) => new Date(val)) // Transform the string into a Date object
    .optional().nullable(),
  updated_at: z.string()
    .refine((val) => !isNaN(Date.parse(val)), {message: "Invalid date string"}) // Validate date string
    .transform((val) => new Date(val)) // Transform the string into a Date object
    .optional().nullable(),
  llm_model_name: z.string().optional().nullable(),
});
