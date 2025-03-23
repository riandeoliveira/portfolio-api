import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(1).max(64),
  email: z.string().trim().min(1).email().max(64),
  message: z.string().trim().min(1).max(1024),
});

export type ContactForm = z.infer<typeof contactSchema>;

export const projectMetadataSchema = z.object({
  stack: z.array(z.string()),
  thumbnailUrl: z.string(),
  repositoryUrl: z.string(),
  projectUrl: z.string(),
  isPrivate: z.boolean(),
  isNew: z.boolean(),
  info: z.object({
    enUs: z.object({
      fullName: z.string(),
      description: z.string(),
    }),
    ptBr: z.object({
      fullName: z.string(),
      description: z.string(),
    }),
  }),
});

export type ProjectMetadata = z.infer<typeof projectMetadataSchema>;

export const projectSchema = z.object({
  name: z.string(),
  version: z.string(),
  metadata: projectMetadataSchema,
});

export type Project = z.infer<typeof projectSchema>;
