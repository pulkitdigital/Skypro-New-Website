import { z } from "zod";
import { DEFAULT_COUNTRY, dialCode } from "@/data/countryCodes";
import { interestOptions, qualificationOptions, startOptions, stateOptions } from "@/data/enquiry";

/** National number: strips spaces/dashes, a pasted +code / 00code (or 91 for India) and a trunk 0. */
export function normaliseMobile(value: string, dial: string) {
  const code = dial.slice(1);
  let digits = value.replace(/[^\d+]/g, "");
  if (digits.startsWith(dial)) digits = digits.slice(dial.length);
  else if (digits.startsWith(`00${code}`)) digits = digits.slice(code.length + 2);
  else if (code === "91" && digits.length === 12 && digits.startsWith("91")) digits = digits.slice(2);
  digits = digits.replace(/\D/g, "");
  return digits.startsWith("0") ? digits.slice(1) : digits;
}

/** India: 10 digits starting 6–9. Elsewhere: 6–14 digits, at most 15 with the country code (E.164). */
function validMobile({ country, number }: { country: string; number: string }) {
  const dial = dialCode(country);
  if (!dial) return false;
  const digits = normaliseMobile(number, dial);
  if (country === "IN") return /^[6-9]\d{9}$/.test(digits);
  return /^\d{6,14}$/.test(digits) && dial.length - 1 + digits.length <= 15;
}

/** "+91 9829012345" — one readable column in the Sheet, whatever the country. */
export const formatMobile = ({ country, number }: { country: string; number: string }) => {
  const dial = dialCode(country) ?? "";
  return `${dial} ${normaliseMobile(number, dial)}`;
};

const oneOf = (options: readonly string[]) => (value: string) => options.includes(value);

export const enquirySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { error: "Please enter your full name." })
    .max(80, { error: "Please enter your full name." })
    .regex(/^[\p{L}][\p{L} .'-]*$/u, { error: "Please enter your full name." }),
  mobile: z
    .object({ country: z.string(), number: z.string().trim() })
    .refine(validMobile, { error: "Enter a valid mobile number.", path: ["number"] }),
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
  mobile: { country: DEFAULT_COUNTRY, number: "" },
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
