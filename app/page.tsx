import Hero from "@/components/home/Hero";
import Mission from "@/components/home/Mission";
import ServicesPreview from "@/components/home/ServicesPreview";
import RealisationsPreview from "@/components/home/RealisationsPreview";
import Testimonials from "@/components/home/Testimonials";
import FAQ from "@/components/home/FAQ";
import QuickContact from "@/components/home/QuickContact";

export default function Home() {
  return (
    <>
      <Hero />
      <Mission />
      <ServicesPreview />
      <RealisationsPreview />
      <Testimonials />
      <FAQ />
      <QuickContact />
    </>
  );
}
