import { Directory } from "@/components/directory";
import { JsonLd } from "@/components/json-ld";
import { homeDescription, homeTitle, pageMetadata, siteName } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";

const organizationId = `${absoluteUrl("/")}/#organization`;
const websiteId = `${absoluteUrl("/")}/#website`;

export const metadata = pageMetadata({
  title: homeTitle,
  description: homeDescription,
  path: "/",
  absoluteTitle: true,
});

export default function Home() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              "@id": organizationId,
              name: siteName,
              alternateName: "Aussie Tools",
              url: absoluteUrl("/"),
              email: "support@aussietools.au",
            },
            {
              "@type": "WebSite",
              "@id": websiteId,
              name: siteName,
              url: absoluteUrl("/"),
              description: homeDescription,
              inLanguage: "en-AU",
              publisher: { "@id": organizationId },
            },
          ],
        }}
      />
      <Directory />
    </>
  );
}
