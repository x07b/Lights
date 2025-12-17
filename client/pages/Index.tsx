import { HeroSection } from "../components/HeroSection";
import { CategoriesSection } from "../components/CategoriesSection";
import { FeaturedProductsSection } from "../components/FeaturedProductsSection";
import { AboutSection } from "../components/AboutSection";
import { NewsletterSection } from "../components/NewsletterSection";

export default function Index() {
  return (
    <div className="w-full">
      <HeroSection />
      <CategoriesSection />
      <FeaturedProductsSection />
      <AboutSection />
      <NewsletterSection />
    </div>
  );
}
