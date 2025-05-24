import React, { useEffect } from 'react';
import Hero from './Hero';
import ProductCards from './ProductCards';
import LimitedEdition from './LimitedEdition';
import { useLocation } from 'react-router-dom';

const Home = ({ addToCart }) => {
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollTo) {
      const section = document.getElementById(location.state.scrollTo);
      if (section) {
        const navbarHeight =
          document.querySelector('.navbar')?.offsetHeight || 70;
        const offsetTop = section.offsetTop - navbarHeight - 10;
        setTimeout(() => {
          window.scrollTo({ top: offsetTop, behavior: 'smooth' });
        }, 10); // Delay to ensure React renders first
      }
    }
  }, [location.state]);

  return (
    <div>
      <section id="hero">
        <Hero />
      </section>
      <section id="products">
        <ProductCards addToCart={addToCart} />
      </section>
      <section id="limited-edition">
        <LimitedEdition />
      </section>
    </div>
  );
};

export default Home;
