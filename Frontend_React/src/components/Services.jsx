import { Car, Map, Users, Shield, Clock, Star } from 'lucide-react';

const services = [
    {
        icon: Car,
        title: 'Transporte Ejecutivo',
        description: 'Vehículos modernos de primer nivel con conductores profesionales para ejecutivos y traslados VIP.',
    },
    {
        icon: Map,
        title: 'Paquetes a Medida',
        description: 'Diseñamos tu experiencia ideal a Machu Picchu, Cusco, Valle Sagrado y los destinos más increíbles.',
    },
    {
        icon: Users,
        title: 'Viajes Grupales',
        description: 'Logística y atención especializada para delegaciones corporativas, familias y operadores turísticos.',
    },
    {
        icon: Shield,
        title: 'Seguridad Garantizada',
        description: 'Flota totalmente asegurada, con licencias al día y conductores profesionales rigurosamente seleccionados.',
    },
    {
        icon: Clock,
        title: 'Disponibilidad 24/7',
        description: 'Asistencia y traslados en cualquier momento para aeropuertos, emergencias o salidas de última hora.',
    },
    {
        icon: Star,
        title: 'Experiencia Premium',
        description: 'Atención al cliente personalizada, guías bilingües y unidades con el máximo nivel de confort y tecnología.',
    },
];

export function Services() {
    return (
        <section id="services" className="py-24 bg-gradient-to-b from-background to-secondary/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mt-4 mb-4 tracking-tight">
                        Nuestros Servicios
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service) => (
                        <div
                            key={service.title}
                            className="bg-card border border-border/60 p-8 rounded-2xl shadow-sm hover:shadow-xl hover:border-primary/20 hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between"
                        >
                            <div>
                                <div className="w-12 h-12 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                                    <service.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-foreground mb-3 tracking-tight">
                                    {service.title}
                                </h3>
                                <p className="text-muted-foreground text-sm leading-relaxed font-light">
                                    {service.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

