import CategoriesBrowsers from './components/CategoriesBrowsers/CategoriesBrowsers';
import Hero from './components/Hero/Hero';
import ProductGrid from './components/ProductGrid/ProductGrid';
import ProductsSection from './components/ProductsSection/ProductsSection';
import SliderSection from './components/SliderSection/SliderSection';

const HomePage = async () => {
  return (
    <div>
      <Hero />
      <ProductGrid />
      <CategoriesBrowsers />
      <ProductsSection />
      <SliderSection />
    </div>
  );
};
export default HomePage;
