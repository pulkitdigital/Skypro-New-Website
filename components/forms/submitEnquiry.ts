import { normaliseMobile, type EnquiryValues } from "./enquirySchema";

const ENDPOINT = process.env.NEXT_PUBLIC_FORM_ENDPOINT ?? "";
const TIMEOUT_MS = 15_000;

export function buildPayload(values: EnquiryValues) {
  return new URLSearchParams({
    name: values.name.trim(),
    mobile: normaliseMobile(values.mobile),
    email: values.email.trim(),
    qualification: values.qualification,
    state: values.state,
    city: values.city.trim(),
    interest: values.interest.join(", "),
    start: values.start,
    question: values.question.trim(),
    consent: values.consent ? "yes" : "no",
    source: "homepage",
    submittedAt: new Date().toISOString(),
    pageUrl: typeof window !== "undefined" ? window.location.href : "",
  });
}

/**
 * Posts the enquiry to the Google Apps Script web app (docs/TRD.md §9).
 * `no-cors` + form-encoding avoids a CORS preflight; the response is opaque,
 * so a resolved fetch counts as success. Empty endpoint → log + success (UI testing).
 */
export async function submitEnquiry(values: EnquiryValues): Promise<void> {
  const payload = buildPayload(values);

  if (!ENDPOINT) {
    console.info("[enquiry] NEXT_PUBLIC_FORM_ENDPOINT is empty — payload not sent:", JSON.stringify(Object.fromEntries(payload)));
    await new Promise((resolve) => setTimeout(resolve, 800));
    return;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    await fetch(ENDPOINT, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
      body: payload,
      signal: controller.signal,
      keepalive: true,
    });
  } finally {
    clearTimeout(timer);
  }
}
