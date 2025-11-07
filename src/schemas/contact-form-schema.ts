import * as yup from "yup";

export const contactFormSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required("required_field")
    .max(64, "max_64_characters"),

  email: yup
    .string()
    .trim()
    .required("required_field")
    .email("email_must_be_valid")
    .max(64, "max_64_characters"),

  message: yup
    .string()
    .trim()
    .required("required_field")
    .max(1024, "max_1024_characters"),
});

export type ContactFormSchema = yup.InferType<typeof contactFormSchema>;
