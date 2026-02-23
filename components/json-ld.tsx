import Script from "next/script";

export const JsonLd = ({ schema }: { schema: Record<string, unknown> }) => (
  <Script
    id="json-ld-schema"
    strategy="beforeInteractive"
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
  />
);
