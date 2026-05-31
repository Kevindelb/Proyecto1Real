<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Semilla para inicializar la Base de Datos del proyecto.
     * Inserta los usuarios de demostración y servicios turísticos predeterminados.
     */
    public function run(): void
    {
        // 1. Limpieza preventiva de datos anteriores
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('usuarios')->truncate();
        DB::table('servicios')->truncate();
        DB::table('carrito')->truncate();
        DB::table('pedidos')->truncate();
        DB::table('detalle_pedido')->truncate();
        DB::table('pagos')->truncate();
        DB::table('facturas')->truncate();
        DB::table('cambios_web')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // 2. Insertar usuarios por defecto
        DB::table('usuarios')->insert([
            [
                'id_usuario' => 1,
                'nombre' => 'Admin',
                'apellidos' => 'Sistema',
                'email' => 'admin@travelandroutes.com',
                // Contraseña encriptada por defecto: 'password'
                'password' => Hash::make('password'),
                'telefono' => '999999999',
                'estado' => 'activo',
                'tipo_usuario' => 'administrador',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id_usuario' => 2,
                'nombre' => 'Kevin',
                'apellidos' => 'Delgado',
                'email' => 'kevin@gmail.com',
                // Contraseña encriptada por defecto: 'password'
                'password' => Hash::make('password'),
                'telefono' => '612345678',
                'estado' => 'activo',
                'tipo_usuario' => 'cliente',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);

        // 3. Insertar 15 servicios premium en el Perú (5 Tours, 5 Hoteles, 5 Transportes)
        DB::table('servicios')->insert([
            // --- 5 TOURS (paquete_turistico / actividad) ---
            [
                'id_servicio' => 1,
                'nombre' => 'Machu Picchu Mágico en Tren Vistadome',
                'descripcion' => 'Explora la mística ciudadela inca de Machu Picchu con un guía arqueológico privado y viaja a bordo del tren panorámico Vistadome.',
                'tipo_servicio' => 'paquete_turistico',
                'destino' => 'Cusco, Perú',
                'precio' => 299.00,
                'duracion_dias' => 1,
                'imagen_url' => 'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&q=80&w=800',
                'fecha_inicio' => '2026-06-01',
                'fecha_fin' => '2026-06-01',
                'estado' => 'activo',
                'fecha_creacion' => now(),
                'fecha_modificacion' => now(),
            ],
            [
                'id_servicio' => 2,
                'nombre' => 'Camino Inca Clásico de 4 Días',
                'descripcion' => 'La caminata más famosa de Sudamérica. Atraviesa ruinas arqueológicas andinas y bellos bosques de niebla hasta ingresar a la Puerta del Sol.',
                'tipo_servicio' => 'paquete_turistico',
                'destino' => 'Cusco, Perú',
                'precio' => 599.00,
                'duracion_dias' => 4,
                'imagen_url' => 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&q=80&w=800',
                'fecha_inicio' => '2026-06-10',
                'fecha_fin' => '2026-06-13',
                'estado' => 'activo',
                'fecha_creacion' => now(),
                'fecha_modificacion' => now(),
            ],
            [
                'id_servicio' => 3,
                'nombre' => 'Montaña de Siete Colores y Valle Rojo',
                'descripcion' => 'Aventura de senderismo de alta montaña a Vinicunca (5,200m) con avistamientos de alpacas silvestres y vistas espectaculares del nevado Ausangate.',
                'tipo_servicio' => 'paquete_turistico',
                'destino' => 'Cusco, Perú',
                'precio' => 49.00,
                'duracion_dias' => 1,
                'imagen_url' => 'https://images.unsplash.com/photo-1590050752117-238cb0612b1b?auto=format&fit=crop&q=80&w=800',
                'fecha_inicio' => '2026-05-30',
                'fecha_fin' => '2026-05-30',
                'estado' => 'activo',
                'fecha_creacion' => now(),
                'fecha_modificacion' => now(),
            ],
            [
                'id_servicio' => 4,
                'nombre' => 'Valle Sagrado de los Incas VIP',
                'descripcion' => 'Visita premium y sin prisas por los complejos arqueológicos de Písac, Ollantaytambo, Chinchero y las icónicas pozas de sal en Maras.',
                'tipo_servicio' => 'paquete_turistico',
                'destino' => 'Cusco, Perú',
                'precio' => 79.00,
                'duracion_dias' => 1,
                'imagen_url' => 'https://images.unsplash.com/photo-1587547131116-a0655a526190?auto=format&fit=crop&q=80&w=800',
                'fecha_inicio' => '2026-06-15',
                'fecha_fin' => '2026-06-15',
                'estado' => 'activo',
                'fecha_creacion' => now(),
                'fecha_modificacion' => now(),
            ],
            [
                'id_servicio' => 5,
                'nombre' => 'Aventura en el Cañón del Colca de 2 Días',
                'descripcion' => 'Disfruta del majestuoso vuelo del Cóndor Andino, paisajes andinos indómitos y relajantes baños termales en el impresionante cañón de Arequipa.',
                'tipo_servicio' => 'paquete_turistico',
                'destino' => 'Arequipa, Perú',
                'precio' => 120.00,
                'duracion_dias' => 2,
                'imagen_url' => 'https://images.unsplash.com/photo-1600697395593-e9dc66797b43?auto=format&fit=crop&q=80&w=800',
                'fecha_inicio' => '2026-06-20',
                'fecha_fin' => '2026-06-21',
                'estado' => 'activo',
                'fecha_creacion' => now(),
                'fecha_modificacion' => now(),
            ],

            // --- 5 HOTELES (hotel) ---
            [
                'id_servicio' => 6,
                'nombre' => 'Belmond Sanctuary Lodge Luxury Resort',
                'descripcion' => 'El único hotel cinco estrellas ubicado directamente frente a la entrada principal de la ciudadela de Machu Picchu. Lujo absoluto en las nubes.',
                'tipo_servicio' => 'hotel',
                'destino' => 'Machu Picchu, Cusco',
                'precio' => 850.00,
                'duracion_dias' => 1,
                'imagen_url' => 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800',
                'fecha_inicio' => '2026-06-01',
                'fecha_fin' => '2026-06-30',
                'estado' => 'activo',
                'fecha_creacion' => now(),
                'fecha_modificacion' => now(),
            ],
            [
                'id_servicio' => 7,
                'nombre' => 'JW Marriott El Convento Cusco',
                'descripcion' => 'Espectacular hotel de lujo construido sobre un convento colonial restaurado del siglo XVI, con sistema de oxígeno suplementario en las habitaciones.',
                'tipo_servicio' => 'hotel',
                'destino' => 'Cusco, Perú',
                'precio' => 320.00,
                'duracion_dias' => 1,
                'imagen_url' => 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=800',
                'fecha_inicio' => '2026-06-01',
                'fecha_fin' => '2026-06-30',
                'estado' => 'activo',
                'fecha_creacion' => now(),
                'fecha_modificacion' => now(),
            ],
            [
                'id_servicio' => 8,
                'nombre' => 'Tambopata Research Center Ecolodge',
                'descripcion' => 'Lujoso ecomuseo y albergue inmerso en la Reserva Nacional de Tambopata. Experimenta la flora y fauna de la selva amazónica de forma exclusiva.',
                'tipo_servicio' => 'hotel',
                'destino' => 'Madre de Dios, Perú',
                'precio' => 450.00,
                'duracion_dias' => 1,
                'imagen_url' => 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&q=80&w=800',
                'fecha_inicio' => '2026-06-01',
                'fecha_fin' => '2026-06-30',
                'estado' => 'activo',
                'fecha_creacion' => now(),
                'fecha_modificacion' => now(),
            ],
            [
                'id_servicio' => 9,
                'nombre' => 'Aranwa Sacred Valley Hotel & Wellness',
                'descripcion' => 'Un santuario de tranquilidad a orillas del río Vilcanota. Spa de clase mundial, piscina climatizada y hermosos jardines históricos.',
                'tipo_servicio' => 'hotel',
                'destino' => 'Urubamba, Valle Sagrado',
                'precio' => 220.00,
                'duracion_dias' => 1,
                'imagen_url' => 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&q=80&w=800',
                'fecha_inicio' => '2026-06-01',
                'fecha_fin' => '2026-06-30',
                'estado' => 'activo',
                'fecha_creacion' => now(),
                'fecha_modificacion' => now(),
            ],
            [
                'id_servicio' => 10,
                'nombre' => 'Hotel Paracas, a Luxury Collection Resort',
                'descripcion' => 'Un resort de clase mundial frente a la bahía de Paracas. Cuenta con spa marino premium, piscinas infinitas y yates privados directos a las Islas Ballestas.',
                'tipo_servicio' => 'hotel',
                'destino' => 'Paracas, Ica',
                'precio' => 280.00,
                'duracion_dias' => 1,
                'imagen_url' => 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=800',
                'fecha_inicio' => '2026-06-01',
                'fecha_fin' => '2026-06-30',
                'estado' => 'activo',
                'fecha_creacion' => now(),
                'fecha_modificacion' => now(),
            ],

            // --- 5 TRANSPORTES / TRASLADOS (transporte) ---
            [
                'id_servicio' => 11,
                'nombre' => 'Traslado Ejecutivo Privado: Aeropuerto Cusco a Hotel',
                'descripcion' => 'Servicio VIP en moderno sedán ejecutivo desde el aeropuerto Alejandro Velasco Astete hacia tu hotel en la ciudad del Cusco.',
                'tipo_servicio' => 'transporte',
                'destino' => 'Cusco, Perú',
                'precio' => 25.00,
                'duracion_dias' => 0,
                'imagen_url' => 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800',
                'fecha_inicio' => '2026-06-01',
                'fecha_fin' => '2026-06-01',
                'estado' => 'activo',
                'fecha_creacion' => now(),
                'fecha_modificacion' => now(),
            ],
            [
                'id_servicio' => 12,
                'nombre' => 'Traslado Familiar en Van: Cusco a Valle Sagrado',
                'descripcion' => 'Transporte privado confortable de hasta 8 pasajeros en Van moderna (Hyundai H1 / Toyota Hiace) ideal para familias.',
                'tipo_servicio' => 'transporte',
                'destino' => 'Valle Sagrado, Cusco',
                'precio' => 75.00,
                'duracion_dias' => 0,
                'imagen_url' => 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=800',
                'fecha_inicio' => '2026-06-01',
                'fecha_fin' => '2026-06-01',
                'estado' => 'activo',
                'fecha_creacion' => now(),
                'fecha_modificacion' => now(),
            ],
            [
                'id_servicio' => 13,
                'nombre' => 'Traslado Premium en Mercedes Benz Clase E: Aeropuerto Lima a Miraflores',
                'descripcion' => 'Servicio premium de lujo en Mercedes Benz Clase E con conductor bilingüe profesional, aire acondicionado, agua embotellada y wifi a bordo.',
                'tipo_servicio' => 'transporte',
                'destino' => 'Lima, Perú',
                'precio' => 60.00,
                'duracion_dias' => 0,
                'imagen_url' => 'https://images.unsplash.com/photo-1619551469797-2a54452140a8?auto=format&fit=crop&q=80&w=800',
                'fecha_inicio' => '2026-06-01',
                'fecha_fin' => '2026-06-01',
                'estado' => 'activo',
                'fecha_creacion' => now(),
                'fecha_modificacion' => now(),
            ],
            [
                'id_servicio' => 14,
                'nombre' => 'Transporte Corporativo Sprinter: Cusco a Hidroeléctrica',
                'descripcion' => 'Minibús Mercedes Benz Sprinter privado de hasta 15 pasajeros con asientos de cuero reclinables de lujo, aire acondicionado y conductor experto.',
                'tipo_servicio' => 'transporte',
                'destino' => 'Cusco - Hidroeléctrica',
                'precio' => 220.00,
                'duracion_dias' => 0,
                'imagen_url' => 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&q=80&w=800',
                'fecha_inicio' => '2026-06-01',
                'fecha_fin' => '2026-06-01',
                'estado' => 'activo',
                'fecha_creacion' => now(),
                'fecha_modificacion' => now(),
            ],
            [
                'id_servicio' => 15,
                'nombre' => 'Camioneta SUV 4x4 Privada: Arequipa a Cañón del Colca',
                'descripcion' => 'Transporte en camioneta SUV Toyota Land Cruiser 4x4 privada. Cruza de forma rápida y cómoda la Reserva Nacional de Salinas y Aguada Blanca.',
                'tipo_servicio' => 'transporte',
                'destino' => 'Arequipa - Colca',
                'precio' => 180.00,
                'duracion_dias' => 0,
                'imagen_url' => 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800',
                'fecha_inicio' => '2026-06-01',
                'fecha_fin' => '2026-06-01',
                'estado' => 'activo',
                'fecha_creacion' => now(),
                'fecha_modificacion' => now(),
            ]
        ]);
    }
}

