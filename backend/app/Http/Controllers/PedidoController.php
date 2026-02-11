<?php

namespace App\Http\Controllers;

use App\Models\Pedido;
use App\Models\DetallePedido;
use App\Models\Carrito;
use App\Models\DatosPago;
use App\Models\Factura;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PedidoController extends Controller
{
    /**
     * Listar pedidos del usuario
     * GET /api/pedidos
     */
    public function index(Request $request)
    {
        $pedidos = Pedido::where('id_usuario', $request->user()->id_usuario)
                        ->with(['detalles.servicio'])
                        ->orderBy('fecha_pedido', 'desc')
                        ->get();

        return response()->json($pedidos);
    }

    /**
     * Ver detalle de un pedido
     * GET /api/pedidos/{id}
     */
    public function show(Request $request, $id)
    {
        $pedido = Pedido::where('id_pedido', $id)
                       ->where('id_usuario', $request->user()->id_usuario)
                       ->with(['detalles.servicio', 'factura'])
                       ->firstOrFail();

        return response()->json($pedido);
    }

    /**
     * Crear pedido (checkout)
     * POST /api/pedidos
     */
    public function store(Request $request)
    {
        $request->validate([
            'metodo_pago' => 'required|in:tarjeta_credito,tarjeta_debito,transferencia,paypal',
            'nombre_titular' => 'required|string|max:150',
            'numero_tarjeta' => 'required|string', // En producción: encriptar
            'tipo_tarjeta' => 'nullable|string|max:50'
        ]);

        // Obtener items del carrito
        $carrito = Carrito::where('id_usuario', $request->user()->id_usuario)
                         ->with('servicio')
                         ->get();

        if ($carrito->isEmpty()) {
            return response()->json([
                'message' => 'El carrito está vacío'
            ], 400);
        }

        // Calcular total
        $total = $carrito->sum(function($item) {
            return $item->servicio->precio * $item->cantidad;
        });

        DB::beginTransaction();
        try {
            // 1. Crear pedido
            $pedido = Pedido::create([
                'id_usuario' => $request->user()->id_usuario,
                'total' => $total,
                'estado_pedido' => 'pendiente',
                'metodo_pago' => $request->metodo_pago,
                'estado_pago' => 'pendiente'
            ]);

            // 2. Crear detalles del pedido
            foreach ($carrito as $item) {
                DetallePedido::create([
                    'id_pedido' => $pedido->id_pedido,
                    'id_servicio' => $item->id_servicio,
                    'cantidad' => $item->cantidad,
                    'precio_unitario' => $item->servicio->precio,
                    'subtotal' => $item->servicio->precio * $item->cantidad,
                    'fecha_viaje' => $item->fecha_viaje,
                    'num_personas' => $item->num_personas
                ]);
            }

            // 3. Procesar pago (simulado)
            $pagoAprobado = $this->procesarPago($request);

            $datosPago = DatosPago::create([
                'id_pedido' => $pedido->id_pedido,
                'nombre_titular' => $request->nombre_titular,
                'numero_tarjeta_encriptado' => encrypt($request->numero_tarjeta),
                'tipo_tarjeta' => $request->tipo_tarjeta,
                'estado_transaccion' => $pagoAprobado ? 'aprobada' : 'rechazada',
                'codigo_autorizacion' => $pagoAprobado ? 'AUTH-' . rand(100000, 999999) : null,
                'mensaje_banco' => $pagoAprobado ? 'Pago aprobado' : 'Fondos insuficientes'
            ]);

            if ($pagoAprobado) {
                // 4. Actualizar estados
                $pedido->update([
                    'estado_pedido' => 'confirmado',
                    'estado_pago' => 'aprobado'
                ]);

                // 5. Generar factura
                $factura = Factura::create([
                    'id_pedido' => $pedido->id_pedido,
                    'numero_factura' => Factura::generarNumeroFactura()
                ]);

                // 6. Vaciar carrito
                Carrito::where('id_usuario', $request->user()->id_usuario)->delete();

                DB::commit();

                return response()->json([
                    'message' => 'Pedido creado exitosamente',
                    'pedido' => $pedido->load(['detalles.servicio', 'factura'])
                ], 201);
            } else {
                // Pago rechazado
                $pedido->update([
                    'estado_pedido' => 'cancelado',
                    'estado_pago' => 'rechazado'
                ]);

                DB::commit();

                return response()->json([
                    'message' => 'Pago rechazado',
                    'error' => 'Fondos insuficientes'
                ], 402);
            }

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Error al procesar el pedido',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Simular procesamiento de pago
     * En producción: integrar con pasarela real (Stripe, PayPal)
     */
    private function procesarPago($request)
    {
        // Simulación: 90% de probabilidad de éxito
        return rand(1, 10) <= 9;
    }

    /**
     * Actualizar estado del pedido (solo admin)
     * PUT /api/pedidos/{id}/estado
     */
    public function updateEstado(Request $request, $id)
    {
        $request->validate([
            'estado_pedido' => 'required|in:pendiente,confirmado,procesando,completado,cancelado'
        ]);

        $pedido = Pedido::findOrFail($id);
        $pedido->update([
            'estado_pedido' => $request->estado_pedido
        ]);

        return response()->json([
            'message' => 'Estado actualizado',
            'pedido' => $pedido
        ]);
    }
}