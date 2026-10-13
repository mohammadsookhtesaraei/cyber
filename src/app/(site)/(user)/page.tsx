import CategoriesBrowsers from './components/CategoriesBrowsers/CategoriesBrowsers';
import Hero from './components/Hero/Hero';
import ProductGrid from './components/ProductGrid/ProductGrid';

const HomePage = () => {
  return (
    <div>
      <Hero />
      <ProductGrid />
      <CategoriesBrowsers />
    </div>
  );
};
export default HomePage;
