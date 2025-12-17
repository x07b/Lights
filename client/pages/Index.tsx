import { HeroSection } from "../components/HeroSection";
import { CategoriesSection } from "../components/CategoriesSection";
import { FeaturedProductsSection } from "../components/FeaturedProductsSection";
import { AboutSection } from "../components/AboutSection";
import { CollectionsSection } from "../components/CollectionsSection";
import { NewsletterSection } from "../components/NewsletterSection";

export default function Index() {
  return (
    <div className="w-full">
      <HeroSection />
      <CategoriesSection />
      <FeaturedProductsSection />
      <AboutSection />
      <CollectionsSection />
      <NewsletterSection />
    </div>
  );
}
