<?php

namespace App\Http\Controllers;

use App\Models\Pedido;
use App\Models\DetallePedido;
use App\Models\Carrito;
use App\Models\DatosPago;
use App\Models\Factura;
use App\Models\Servicio;
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

    public function adminIndex()
    {
        $pedidos = Pedido::with(['usuario', 'detalles.servicio', 'factura', 'datosPago'])
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
                       ->with(['detalles.servicio', 'factura', 'datosPago'])
                       ->when(!$request->user()->isAdmin(), function ($query) use ($request) {
                           $query->where('id_usuario', $request->user()->id_usuario);
                       })
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
            'nombre_titular' => 'required_if:metodo_pago,tarjeta_credito,tarjeta_debito|nullable|string|max:150',
            'numero_tarjeta' => 'required_if:metodo_pago,tarjeta_credito,tarjeta_debito|nullable|string',
            'referencia_externa' => 'nullable|string|max:150'
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
            $serviciosBloqueados = [];
            foreach ($carrito as $item) {
                $servicio = Servicio::lockForUpdate()->findOrFail($item->id_servicio);

                if ($servicio->estado !== 'activo' || $servicio->disponibilidad < $item->cantidad) {
                    DB::rollBack();

                    return response()->json([
                        'message' => 'Servicio sin disponibilidad suficiente',
                        'id_servicio' => $servicio->id_servicio
                    ], 400);
                }
                
                $serviciosBloqueados[$item->id_servicio] = $servicio;
            }

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
            $referenciaPago = $pagoAprobado
                ? 'AUTH-' . rand(100000, 999999)
                : 'RECH-' . rand(100000, 999999);

            DatosPago::create([
                'id_pedido' => $pedido->id_pedido,
                'proveedor' => $this->proveedorPago($request->metodo_pago),
                'referencia_externa' => $request->referencia_externa ?? $referenciaPago,
                'monto' => $total,
                'moneda' => 'EUR',
                'estado_transaccion' => $pagoAprobado ? 'aprobado' : 'rechazado',
                'fecha_pago' => now()
            ]);

            if ($pagoAprobado) {
                foreach ($carrito as $item) {
                    $servicio = $serviciosBloqueados[$item->id_servicio];
                    $servicio->disponibilidad -= $item->cantidad;

                    if ($servicio->disponibilidad <= 0) {
                        $servicio->disponibilidad = 0;
                        $servicio->estado = 'agotado';
                    }

                    $servicio->save();
                }

                // 4. Actualizar estados
                $pedido->update([
                    'estado_pedido' => 'confirmado',
                    'estado_pago' => 'aprobado'
                ]);

                // 5. Generar factura
                $factura = Factura::create([
                    'id_pedido' => $pedido->id_pedido,
                    'numero_factura' => Factura::generarNumeroFactura(),
                    'email_enviado' => true,
                    'fecha_envio_email' => now()
                ]);

                // 6. Vaciar carrito
                Carrito::where('id_usuario', $request->user()->id_usuario)->delete();

                DB::commit();

                return response()->json([
                    'message' => 'Pedido creado exitosamente',
                    'pedido' => $pedido->load(['detalles.servicio', 'factura', 'datosPago'])
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

    private function proveedorPago(string $metodoPago): string
    {
        return match ($metodoPago) {
            'paypal' => 'paypal',
            'transferencia' => 'transferencia',
            default => 'stripe',
        };
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
