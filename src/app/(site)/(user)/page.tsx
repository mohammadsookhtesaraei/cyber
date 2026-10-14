import CategoriesBrowsers from './components/CategoriesBrowsers/CategoriesBrowsers';
import Hero from './components/Hero/Hero';
import ProductGrid from './components/ProductGrid/ProductGrid';
import ProductsSection from './components/ProductsSection/ProductsSection';

const HomePage = async () => {
  return (
    <div>
      <Hero />
      <ProductGrid />
      <CategoriesBrowsers />
      <ProductsSection />
    </div>
  );
};
export default HomePage;
