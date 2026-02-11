<?php

namespace App\Http\Controllers;

use App\Models\Carrito;
use App\Models\Servicio;
use Illuminate\Http\Request;

class CarritoController extends Controller
{
    /**
     * Ver carrito del usuario autenticado
     * GET /api/carrito
     */
    public function index(Request $request)
    {
        $carrito = Carrito::where('id_usuario', $request->user()->id_usuario)
                         ->with('servicio')
                         ->get();

        // Calcular total
        $total = $carrito->sum(function($item) {
            return $item->servicio->precio * $item->cantidad;
        });

        return response()->json([
            'items' => $carrito,
            'total' => $total
        ]);
    }

    /**
     * Agregar servicio al carrito
     * POST /api/carrito
     */
    public function store(Request $request)
    {
        $request->validate([
            'id_servicio' => 'required|exists:servicios,id_servicio',
            'cantidad' => 'required|integer|min:1',
            'fecha_viaje' => 'nullable|date|after:today',
            'num_personas' => 'required|integer|min:1'
        ]);

        // Verificar disponibilidad
        $servicio = Servicio::findOrFail($request->id_servicio);
        if (!$servicio->estaDisponible()) {
            return response()->json([
                'message' => 'Servicio no disponible'
            ], 400);
        }

        // Verificar si ya existe en el carrito
        $itemExistente = Carrito::where('id_usuario', $request->user()->id_usuario)
                                ->where('id_servicio', $request->id_servicio)
                                ->first();

        if ($itemExistente) {
            // Actualizar cantidad
            $itemExistente->cantidad += $request->cantidad;
            $itemExistente->save();
            $item = $itemExistente;
        } else {
            // Crear nuevo item
            $item = Carrito::create([
                'id_usuario' => $request->user()->id_usuario,
                'id_servicio' => $request->id_servicio,
                'cantidad' => $request->cantidad,
                'fecha_viaje' => $request->fecha_viaje,
                'num_personas' => $request->num_personas,
                'observaciones' => $request->observaciones
            ]);
        }

        return response()->json([
            'message' => 'Servicio agregado al carrito',
            'item' => $item->load('servicio')
        ], 201);
    }

    /**
     * Actualizar cantidad en carrito
     * PUT /api/carrito/{id}
     */
    public function update(Request $request, $id)
    {
        $item = Carrito::where('id_carrito', $id)
                      ->where('id_usuario', $request->user()->id_usuario)
                      ->firstOrFail();

        $request->validate([
            'cantidad' => 'required|integer|min:1',
            'fecha_viaje' => 'nullable|date|after:today',
            'num_personas' => 'nullable|integer|min:1'
        ]);

        $item->update($request->all());

        return response()->json([
            'message' => 'Carrito actualizado',
            'item' => $item->load('servicio')
        ]);
    }

    /**
     * Eliminar del carrito
     * DELETE /api/carrito/{id}
     */
    public function destroy(Request $request, $id)
    {
        $item = Carrito::where('id_carrito', $id)
                      ->where('id_usuario', $request->user()->id_usuario)
                      ->firstOrFail();

        $item->delete();

        return response()->json([
            'message' => 'Servicio eliminado del carrito'
        ]);
    }

    /**
     * Vaciar todo el carrito
     * DELETE /api/carrito
     */
    public function clear(Request $request)
    {
        Carrito::where('id_usuario', $request->user()->id_usuario)->delete();

        return response()->json([
            'message' => 'Carrito vaciado'
        ]);
    }
}