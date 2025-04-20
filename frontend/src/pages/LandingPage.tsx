import {
  BgCanvas,
  Navbar,
  FeaturesSection,
  CTASection,
  Footer,
  HeroSection,
} from "@/components";

export default function LandingPage() {
  return (
    <div className="min-h-screen text-white">
      <Navbar />
      <BgCanvas />
      <HeroSection />
      <FeaturesSection />
      <CTASection />
      <Footer />
    </div>
  );
}
