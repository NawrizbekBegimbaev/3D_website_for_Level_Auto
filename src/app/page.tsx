import { CarShowcase } from "@/components/CarShowcase";
import { FeaturedCars } from "@/components/FeaturedCars";
import { About } from "@/components/About";
import { ContactSection } from "@/components/ContactSection";

export default function Home() {
  return (
    <>
      <CarShowcase />
      <FeaturedCars />
      <About />
      <ContactSection />
    </>
  );
}
