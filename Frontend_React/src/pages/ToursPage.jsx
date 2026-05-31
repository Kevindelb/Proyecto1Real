import { Header } from '../components/Header';
import { TourCatalog } from '../components/TourCatalog';
import { Footer } from '../components/Footer';

export default function ToursPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      {/* banner principal de la pagina  */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/Huaytapallana.JPG"
            alt="Tours"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>
        <div className="relative z-10 text-center text-white px-4 mt-16 animate-in fade-in zoom-in-95 duration-500">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-wide uppercase">Nuestros Tours Exclusivos</h1>
        </div>
      </div>

      <main className="flex-grow">
        <TourCatalog />
      </main>

      <Footer />
    </div>
  );
}

