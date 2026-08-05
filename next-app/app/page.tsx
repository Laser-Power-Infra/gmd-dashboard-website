import Hero from '@/components/home/Hero';
import AboutUs from '@/components/home/AboutUs';
import Services from '@/components/home/Services';
import Products from '@/components/home/Products';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import VisionMission from '@/components/home/VisionMission';
import Clients from '@/components/home/Clients';

export default function HomePage() {
  return (
    <>
      <div id="home">
        <Hero />
      </div>
      <div id="about-us">
        <AboutUs />
      </div>
      <div id="services">
        <Services />
      </div>
      <div id="products">
        <Products />
      </div>
      <div id="why-choose-us">
        <WhyChooseUs />
      </div>
      <div id="vision-mission">
        <VisionMission />
      </div>
      <Clients />
    </>
  );
}
