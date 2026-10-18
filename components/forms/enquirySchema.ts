import { z } from "zod";
import { interestOptions, qualificationOptions, startOptions, stateOptions } from "@/data/enquiry";

/** Strips spaces/dashes and a leading +91 / 91 / 0 → 10 digits. */
export function normaliseMobile(value: string) {
  let digits = value.replace(/[^\d+]/g, "");
  if (digits.startsWith("+91")) digits = digits.slice(3);
  else if (digits.length === 12 && digits.startsWith("91")) digits = digits.slice(2);
  else if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);
  return digits.replace(/\D/g, "");
}

const oneOf = (options: readonly string[]) => (value: string) => options.includes(value);

export const enquirySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { error: "Please enter your full name." })
    .max(80, { error: "Please enter your full name." })
    .regex(/^[\p{L}][\p{L} .'-]*$/u, { error: "Please enter your full name." }),
  mobile: z
    .string()
    .trim()
    .refine((v) => /^[6-9]\d{9}$/.test(normaliseMobile(v)), { error: "Enter a valid 10-digit Indian mobile number." }),
  email: z.string().trim().pipe(z.email({ error: "Enter a valid email address." })),
  qualification: z.string().refine(oneOf(qualificationOptions), { error: "Please choose an option." }),
  state: z.string().refine(oneOf(stateOptions), { error: "Please choose your state." }),
  city: z
    .string()
    .trim()
    .min(2, { error: "Please enter your city." })
    .max(60, { error: "Please enter your city." }),
  interest: z
    .array(z.string().refine(oneOf(interestOptions)))
    .min(1, { error: "Select at least one option." }),
  start: z.string().refine(oneOf(startOptions), { error: "Please choose one." }),
  question: z.string().max(2000, { error: "Please keep your question under 2000 characters." }),
  consent: z.boolean().refine((v) => v, { error: "Please agree so we can contact you." }),
  /** Honeypot — must stay empty. */
  company: z.string(),
});

export type EnquiryValues = z.infer<typeof enquirySchema>;

export const enquiryDefaults: EnquiryValues = {
  name: "",
  mobile: "",
  email: "",
  qualification: "",
  state: "",
  city: "",
  interest: [],
  start: "",
  question: "",
  consent: false,
  company: "",
};
