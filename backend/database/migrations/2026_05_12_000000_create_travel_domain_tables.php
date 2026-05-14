<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    private const MARKER_TABLE = 'travel_domain_migration_tables';

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $createdTables = [];

        if (! Schema::hasTable('usuarios')) {
            Schema::create('usuarios', function (Blueprint $table) {
                $table->increments('id_usuario');
                $table->string('nombre', 100);
                $table->string('apellidos', 100);
                $table->string('email', 150)->unique();
                $table->string('password');
                $table->string('telefono', 20)->nullable();
                $table->dateTime('fecha_registro')->useCurrent();
                $table->dateTime('ultimo_acceso')->nullable();
                $table->enum('estado', ['activo', 'inactivo', 'suspendido'])->default('activo');
                $table->enum('tipo_usuario', ['cliente', 'administrador'])->default('cliente');
            });

            $createdTables[] = 'usuarios';
        }

        if (! Schema::hasTable('servicios')) {
            Schema::create('servicios', function (Blueprint $table) {
                $table->increments('id_servicio');
                $table->string('nombre', 200);
                $table->text('descripcion')->nullable();
                $table->enum('tipo_servicio', [
                    'paquete_turistico',
                    'hotel',
                    'vuelo',
                    'excursion',
                    'transporte',
                    'actividad',
                    'otros',
                ])->nullable();
                $table->string('destino', 150)->nullable();
                $table->decimal('precio', 10, 2);
                $table->integer('disponibilidad')->default(100);
                $table->integer('duracion_dias')->nullable();
                $table->string('imagen_url')->nullable();
                $table->date('fecha_inicio')->nullable();
                $table->date('fecha_fin')->nullable();
                $table->enum('estado', ['activo', 'inactivo', 'agotado'])->default('activo');
                $table->dateTime('fecha_creacion')->useCurrent();
                $table->dateTime('fecha_modificacion')->useCurrent()->useCurrentOnUpdate();
            });

            $createdTables[] = 'servicios';
        }

        if (! Schema::hasTable('carrito')) {
            Schema::create('carrito', function (Blueprint $table) {
                $table->increments('id_carrito');
                $table->unsignedInteger('id_usuario');
                $table->unsignedInteger('id_servicio');
                $table->integer('cantidad')->default(1);
                $table->dateTime('fecha_agregado')->useCurrent();
                $table->date('fecha_viaje')->nullable();
                $table->integer('num_personas')->default(1);
                $table->text('observaciones')->nullable();

                $table->foreign('id_usuario')->references('id_usuario')->on('usuarios')->cascadeOnDelete();
                $table->foreign('id_servicio')->references('id_servicio')->on('servicios')->cascadeOnDelete();
            });

            $createdTables[] = 'carrito';
        }

        if (! Schema::hasTable('pedidos')) {
            Schema::create('pedidos', function (Blueprint $table) {
                $table->increments('id_pedido');
                $table->unsignedInteger('id_usuario');
                $table->dateTime('fecha_pedido')->useCurrent();
                $table->decimal('total', 10, 2);
                $table->enum('estado_pedido', ['pendiente', 'confirmado', 'procesando', 'completado', 'cancelado'])->default('pendiente');
                $table->enum('metodo_pago', ['tarjeta_credito', 'tarjeta_debito', 'transferencia', 'paypal']);
                $table->enum('estado_pago', ['pendiente', 'aprobado', 'rechazado', 'reembolsado'])->default('pendiente');

                $table->foreign('id_usuario')->references('id_usuario')->on('usuarios');
            });

            $createdTables[] = 'pedidos';
        }

        if (! Schema::hasTable('detalle_pedido')) {
            Schema::create('detalle_pedido', function (Blueprint $table) {
                $table->increments('id_detalle');
                $table->unsignedInteger('id_pedido');
                $table->unsignedInteger('id_servicio');
                $table->integer('cantidad');
                $table->decimal('precio_unitario', 10, 2);
                $table->decimal('subtotal', 10, 2);
                $table->date('fecha_viaje')->nullable();
                $table->integer('num_personas')->default(1);

                $table->foreign('id_pedido')->references('id_pedido')->on('pedidos')->cascadeOnDelete();
                $table->foreign('id_servicio')->references('id_servicio')->on('servicios');
            });

            $createdTables[] = 'detalle_pedido';
        }

        if (! Schema::hasTable('pagos')) {
            Schema::create('pagos', function (Blueprint $table) {
                $table->increments('id_pago');
                $table->unsignedInteger('id_pedido');
                $table->enum('proveedor', ['stripe', 'paypal', 'mercadopago', 'transferencia'])->nullable();
                $table->string('referencia_externa', 150);
                $table->decimal('monto', 10, 2);
                $table->string('moneda', 10)->default('EUR');
                $table->enum('estado_transaccion', ['pendiente', 'aprobado', 'rechazado', 'reembolsado'])->default('pendiente');
                $table->dateTime('fecha_pago')->nullable();
                $table->dateTime('creado_en')->useCurrent();

                $table->foreign('id_pedido')->references('id_pedido')->on('pedidos')->cascadeOnDelete();
            });

            $createdTables[] = 'pagos';
        }

        if (! Schema::hasTable('facturas')) {
            Schema::create('facturas', function (Blueprint $table) {
                $table->increments('id_factura');
                $table->unsignedInteger('id_pedido')->unique();
                $table->string('numero_factura', 50)->unique();
                $table->dateTime('fecha_emision')->useCurrent();
                $table->boolean('email_enviado')->default(false);
                $table->dateTime('fecha_envio_email')->nullable();
                $table->string('ruta_pdf')->nullable();

                $table->foreign('id_pedido')->references('id_pedido')->on('pedidos');
            });

            $createdTables[] = 'facturas';
        }

        if (! Schema::hasTable('cambios_web')) {
            Schema::create('cambios_web', function (Blueprint $table) {
                $table->increments('id_cambio');
                $table->unsignedInteger('id_administrador');
                $table->unsignedInteger('id_servicio')->nullable();
                $table->enum('accion', ['crear', 'modificar', 'eliminar']);
                $table->dateTime('fecha_accion')->useCurrent();
                $table->json('datos_anteriores')->nullable();
                $table->json('datos_nuevos')->nullable();

                $table->foreign('id_administrador')->references('id_usuario')->on('usuarios');
                $table->foreign('id_servicio')->references('id_servicio')->on('servicios')->nullOnDelete();
            });

            $createdTables[] = 'cambios_web';
        }

        if (! Schema::hasTable('conversaciones_chat')) {
            Schema::create('conversaciones_chat', function (Blueprint $table) {
                $table->increments('id_conversacion');
                $table->unsignedInteger('id_usuario');
                $table->unsignedInteger('id_administrador')->nullable();
                $table->dateTime('fecha_inicio')->useCurrent();
                $table->dateTime('fecha_fin')->nullable();
                $table->enum('estado', ['abierta', 'en_proceso', 'cerrada'])->default('abierta');
                $table->integer('calificacion')->nullable();
                $table->text('comentario_calificacion')->nullable();

                $table->foreign('id_usuario')->references('id_usuario')->on('usuarios');
                $table->foreign('id_administrador')->references('id_usuario')->on('usuarios');
            });

            $createdTables[] = 'conversaciones_chat';
        }

        if (! Schema::hasTable('mensajes_chat')) {
            Schema::create('mensajes_chat', function (Blueprint $table) {
                $table->increments('id_mensaje');
                $table->unsignedInteger('id_conversacion');
                $table->unsignedInteger('id_remitente');
                $table->text('mensaje');
                $table->dateTime('fecha_envio')->useCurrent();
                $table->boolean('leido')->default(false);

                $table->foreign('id_conversacion')->references('id_conversacion')->on('conversaciones_chat')->cascadeOnDelete();
                $table->foreign('id_remitente')->references('id_usuario')->on('usuarios');
            });

            $createdTables[] = 'mensajes_chat';
        }

        if ($createdTables !== []) {
            Schema::create(self::MARKER_TABLE, function (Blueprint $table) {
                $table->string('table_name')->primary();
            });

            foreach ($createdTables as $tableName) {
                DB::table(self::MARKER_TABLE)->insert(['table_name' => $tableName]);
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (! Schema::hasTable(self::MARKER_TABLE)) {
            return;
        }

        $createdTables = DB::table(self::MARKER_TABLE)->pluck('table_name')->all();

        foreach ([
            'mensajes_chat',
            'conversaciones_chat',
            'cambios_web',
            'facturas',
            'pagos',
            'detalle_pedido',
            'pedidos',
            'carrito',
            'servicios',
            'usuarios',
        ] as $tableName) {
            if (in_array($tableName, $createdTables, true)) {
                Schema::dropIfExists($tableName);
            }
        }

        Schema::dropIfExists(self::MARKER_TABLE);
    }
};
