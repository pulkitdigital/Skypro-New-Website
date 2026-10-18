import { site } from "@/data/site";
import { faqs } from "@/data/faq";
import { about } from "@/data/sections";

/** EducationalOrganization + FAQPage, built from the same data as the visible page. */
export function JsonLd() {
  const organization = {
    "@type": "EducationalOrganization",
    "@id": `${site.url}/#organization`,
    name: site.name,
    url: site.url,
    logo: `${site.url}${site.logo.color.src}`,
    image: `${site.url}${site.seo.ogImage}`,
    description: about.paragraphs[0],
    telephone: site.phoneDisplay,
    email: site.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.line1,
      addressLocality: site.address.city,
      addressRegion: site.address.state,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng },
    sameAs: site.socials.map((s) => s.url),
  };

  const faqPage = {
    "@type": "FAQPage",
    "@id": `${site.url}/#faq`,
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  const json = { "@context": "https://schema.org", "@graph": [organization, faqPage] };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json).replace(/</g, "\\u003c") }}
    />
  );
}
