import { faqItems } from "@/content/faq-items";
import {
  W3_LONDON_ADDRESS,
  W3_SINGAPORE_ADDRESS,
} from "@/content/offices";
import { getSiteOrigin } from "@/lib/site";

function londonPostalAddress(): Record<string, string> {
  const [street, locality, postal] = W3_LONDON_ADDRESS;
  return {
    "@type": "PostalAddress",
    streetAddress: street,
    addressLocality: locality,
    postalCode: postal,
    addressCountry: "GB",
  };
}

function singaporePostalAddress(): Record<string, string> {
  const [line1, line2, locality] = W3_SINGAPORE_ADDRESS;
  return {
    "@type": "PostalAddress",
    streetAddress: `${line1}, ${line2}`,
    addressLocality: locality,
    addressCountry: "SG",
  };
}

export function HomeJsonLd() {
  const origin = getSiteOrigin();
  const graph: Record<string, unknown>[] = [
    {
      "@type": "Organization",
      "@id": `${origin}/#organization`,
      name: "W3 Sourcing",
      url: origin,
      email: "info@w3sourcing.com",
      address: [londonPostalAddress(), singaporePostalAddress()],
      areaServed: [
        { "@type": "Place", name: "United States" },
        { "@type": "Place", name: "United Kingdom" },
        { "@type": "Place", name: "European Union" },
        { "@type": "Place", name: "United Arab Emirates" },
        { "@type": "Place", name: "Singapore" },
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${origin}/#website`,
      name: "W3 Sourcing",
      url: origin,
      publisher: { "@id": `${origin}/#organization` },
      inLanguage: "en-GB",
    },
    {
      "@type": "FAQPage",
      "@id": `${origin}/#faq`,
      mainEntity: faqItems.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.a,
        },
      })),
    },
  ];

  const payload = {
    "@context": "https://schema.org",
    "@graph": graph,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}
