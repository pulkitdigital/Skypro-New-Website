/** Enquiry form copy and options — verbatim from the live Contact Form 7 form. */
export const enquiryForm = {
  // Short intro beside the form (new UI copy, built from the approved success text — PRD OQ-13)
  intro: "Share your details and our team will contact you shortly.",
  fields: {
    name: { label: "Full Name*", placeholder: "Enter your full name" },
    mobile: { label: "Mobile No.*", placeholder: "Enter your mobile no." },
    email: { label: "Email Address*", placeholder: "name@example.com" },
    qualification: { label: "Current Education Qualification*", placeholder: "—Please choose an option—" },
    state: { label: "State*", placeholder: "—Please choose an option—" },
    city: { label: "City*", placeholder: "Your city" },
    interest: { label: "Which of these are you interested in?*" },
    start: { label: "How soon do you plan to start?*" },
    question: {
      label: "Any specific question you’d like us to assist with?",
      placeholder: "Ask us anything about training, eligibility, fees, process…",
    },
    consent: {
      label:
        "I agree to receive communication from SkyPro Aviation via phone, email, or WhatsApp for updates and assistance related to my inquiry.",
    },
  },
  submit: "Submit Enquiry",
  sending: "Sending…",
  // New UI copy (PRD OQ-13, approved default)
  success: {
    title: (firstName: string) => `Thank you, ${firstName}!`,
    text: "We have received your enquiry. Our team will contact you shortly.",
    again: "Send another enquiry",
  },
  error: {
    text: "Something went wrong. Please try again or call +91-8955804726.",
    retry: "Try again",
  },
} as const;

export const qualificationOptions = ["10th", "12th Appearing", "12th Pass", "Graduation"] as const;

export const stateOptions = [
  "Andaman & Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra & Nagar Haveli and Daman & Diu",
  "Delhi (NCT)",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu & Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
] as const;

export const interestOptions = [
  "DGCA Ground Classes (CPL)",
  "Flying Training",
  "Conversion & Recency",
  "Career Counselling",
] as const;

export const startOptions = [
  "Immediately (0-3 months)",
  "Soon (3-6 months)",
  "Later (6-12 months)",
  "Just Exploring for Now",
] as const;
