import { Mountain, Camera, Award, ShieldCheck } from 'lucide-react';

export function HomeFeatures() {
  const features = [
    {
      icon: Mountain,
      title: 'Destinos increíbles',
      description: 'Desde la costa hasta la sierra y la selva, vive lo mejor del Perú.',
    },
    {
      icon: Camera,
      title: 'Experiencias auténticas',
      description: 'Conecta con nuestra cultura, gente y tradiciones.',
    },
    {
      icon: Award,
      title: 'Servicio personalizado',
      description: 'Diseñamos tu viaje a medida con atención local 24/7.',
    },
    {
      icon: ShieldCheck,
      title: 'Viaja con confianza',
      description: 'Operadores turísticos certificados y seguros.',
    },
  ];

  return (
    <section className="py-12 bg-[#fcfaf6] border-b border-neutral-100" style={{ fontFamily: "'Outfit', sans-serif" }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div 
                key={idx} 
                className="flex items-center gap-4 p-4 rounded-xl hover:bg-white hover:shadow-md transition-all duration-300 group"
              >
                <div className="flex-shrink-0 w-16 h-16 rounded-full border border-[#062e20]/20 bg-white flex items-center justify-center text-[#062e20] shadow-xs group-hover:scale-105 group-hover:border-[#84cc16] transition-all duration-300">
                  <Icon className="w-7 h-7 stroke-[1.5]" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-[#062e20] leading-tight">
                    {feature.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-500 leading-snug">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
