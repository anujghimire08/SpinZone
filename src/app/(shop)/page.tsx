import CategorySection from "@/features/storefront/components/category-section";
import FeaturedProducts from "@/features/storefront/components/featured-products";
import HeroSection from "@/features/storefront/components/hero-section";

const HomePage = () => {
  return (
    <>
      <HeroSection />
      <CategorySection />
      <FeaturedProducts />
    </>
  );
};

export default HomePage;
