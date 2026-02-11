<?php

namespace App\Http\Controllers;

use App\Models\Servicio;
use App\Models\AuditoriaContenido;
use App\Models\Usuario;
use Illuminate\Http\Request;

class ServicioController extends Controller
{
    /**
     * Listar todos los servicios activos
     * GET /api/servicios
     */
    public function index(Request $request)
    {
        $query = Servicio::query();
        $usuarioAutenticado = auth('sanctum')->user();
        $esAdmin = $usuarioAutenticado instanceof Usuario && $usuarioAutenticado->isAdmin();

        // Filtrar por tipo de servicio
        if ($request->has('tipo')) {
            $query->where('tipo_servicio', $request->tipo);
        }

        // Filtrar por destino
        if ($request->has('destino')) {
            $query->where('destino', 'like', '%' . $request->destino . '%');
        }

        // Solo mostrar activos a clientes
        if (!$esAdmin) {
            $query->activos();
        }

        $servicios = $query->get();

        return response()->json($servicios);
    }

    /**
     * Ver detalle de un servicio
     * GET /api/servicios/{id}
     */
    public function show($id)
    {
        $servicio = Servicio::findOrFail($id);
        return response()->json($servicio);
    }

    /**
     * Crear nuevo servicio (solo admin)
     * POST /api/servicios
     */
    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:200',
            'tipo_servicio' => 'required|in:paquete_turistico,hotel,vuelo,excursion,transporte,actividad',
            'precio' => 'required|numeric|min:0',
            'descripcion' => 'nullable|string',
            'destino' => 'nullable|string|max:150',
            'disponibilidad' => 'nullable|integer|min:0',
            'duracion_dias' => 'nullable|integer|min:0'
        ]);

        $servicio = Servicio::create($request->all());

        // Registrar auditoría
        AuditoriaContenido::create([
            'id_administrador' => $request->user()->id_usuario,
            'id_servicio' => $servicio->id_servicio,
            'accion' => 'crear',
            'datos_nuevos' => $servicio->toArray()
        ]);

        return response()->json([
            'message' => 'Servicio creado exitosamente',
            'servicio' => $servicio
        ], 201);
    }

    /**
     * Actualizar servicio (solo admin)
     * PUT /api/servicios/{id}
     */
    public function update(Request $request, $id)
    {
        $servicio = Servicio::findOrFail($id);
        $datosAnteriores = $servicio->toArray();

        $request->validate([
            'nombre' => 'sometimes|string|max:200',
            'tipo_servicio' => 'sometimes|in:paquete_turistico,hotel,vuelo,excursion,transporte,actividad',
            'precio' => 'sometimes|numeric|min:0',
            'disponibilidad' => 'sometimes|integer|min:0'
        ]);

        $servicio->update($request->all());

        // Registrar auditoría
        AuditoriaContenido::create([
            'id_administrador' => $request->user()->id_usuario,
            'id_servicio' => $servicio->id_servicio,
            'accion' => 'modificar',
            'datos_anteriores' => $datosAnteriores,
            'datos_nuevos' => $servicio->toArray()
        ]);

        return response()->json([
            'message' => 'Servicio actualizado exitosamente',
            'servicio' => $servicio
        ]);
    }

    /**
     * Eliminar servicio (solo admin)
     * DELETE /api/servicios/{id}
     */
    public function destroy(Request $request, $id)
    {
        $servicio = Servicio::findOrFail($id);
        $datosAnteriores = $servicio->toArray();

        // Registrar auditoría antes de eliminar
        AuditoriaContenido::create([
            'id_administrador' => $request->user()->id_usuario,
            'id_servicio' => $servicio->id_servicio,
            'accion' => 'eliminar',
            'datos_anteriores' => $datosAnteriores
        ]);

        $servicio->delete();

        return response()->json([
            'message' => 'Servicio eliminado exitosamente'
        ]);
    }
}
