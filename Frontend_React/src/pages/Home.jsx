import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { HomeFeatures } from '../components/HomeFeatures';
import { PopularDestinations } from '../components/PopularDestinations';
import { CustomTrips } from '../components/CustomTrips';
import { HomeServices } from '../components/HomeServices';
import { TestimonialsAndPartners } from '../components/TestimonialsAndPartners';
import { Footer } from '../components/Footer';

function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        <HomeFeatures />
        <PopularDestinations />
        <CustomTrips />
        <HomeServices />
        <TestimonialsAndPartners />
      </main>
      <Footer />
    </div>
  );
}

export default Home;
