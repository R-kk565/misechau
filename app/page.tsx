import { ContactSection } from "@/components/contact-section";
import { GallerySection } from "@/components/gallery-marquee";
import { Hero } from "@/components/hero";
import { LinksSection } from "@/components/links-section";
import { ProfileSection } from "@/components/profile-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <ProfileSection />
        <GallerySection />
        <LinksSection />
        <ContactSection />
      </main>
      <SiteFooter />
    </>
  );
}
