import Contact from "@/components/sections/Contact";
import Hero from "@/components/sections/Hero";
import Location from "@/components/sections/Location";
import Services from "@/components/sections/Services";
import Showcase from "@/components/sections/Showcase";
import StudioStory from "@/components/sections/StudioStory";
import { SETS } from "@/data/sets";
import { GOOGLE_MAPS, STUDIO_CONTACT } from "@/data/studio";
import { SITE_NAME, SITE_URL } from "@/lib/site";

// Business details for Google Search and Maps (https://schema.org/LocalBusiness)
const businessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: SITE_NAME,
  description: `Photo and film studio in Noida with ${SETS.length} designed sets for hire.`,
  url: SITE_URL,
  image: `${SITE_URL}/images/share/home.jpg`,
  logo: `${SITE_URL}/images/logos/logo-lockup-dark.png`,
  email: STUDIO_CONTACT.email,
  telephone: STUDIO_CONTACT.phones.map((phone) => phone.replaceAll(" ", "")),
  address: {
    "@type": "PostalAddress",
    streetAddress: STUDIO_CONTACT.streetAddress,
    addressLocality: STUDIO_CONTACT.locality,
    addressRegion: STUDIO_CONTACT.region,
    postalCode: STUDIO_CONTACT.postalCode,
    addressCountry: STUDIO_CONTACT.country,
  },
  hasMap: GOOGLE_MAPS.place,
  ...(STUDIO_CONTACT.socials.length > 0 && {
    sameAs: STUDIO_CONTACT.socials.map((social) => social.href),
  }),
};

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(businessJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Hero />
      <Showcase />
      <StudioStory />
      <Services />
      <Contact />
      <Location />
    </main>
  );
}
