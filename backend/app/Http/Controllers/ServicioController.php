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
    public function show(Request $request, $id)
    {
        $query = Servicio::where('id_servicio', $id);
        $usuarioAutenticado = auth('sanctum')->user();
        $esAdmin = $usuarioAutenticado instanceof Usuario && $usuarioAutenticado->isAdmin();

        if (! $esAdmin) {
            $query->activos();
        }

        $servicio = $query->firstOrFail();

        return response()->json($servicio);
    }

    /**
     * Crear nuevo servicio (solo admin)
     * POST /api/servicios
     */
    public function store(Request $request)
    {
        $reglas = [
            'nombre' => 'required|string|max:200',
            'tipo_servicio' => 'required|in:paquete_turistico,hotel,vuelo,excursion,transporte,actividad,otros',
            'precio' => 'required|numeric|min:0',
            'descripcion' => 'nullable|string',
            'destino' => 'nullable|string|max:150',
            'disponibilidad' => 'nullable|integer|min:0',
            'duracion_dias' => 'nullable|integer|min:0',
            'imagen_url' => 'nullable|url|max:255',
            'fecha_inicio' => 'nullable|date',
            'fecha_fin' => 'nullable|date',
            'estado' => 'nullable|in:activo,inactivo,agotado'
        ];

        if ($request->filled('fecha_inicio')) {
            $reglas['fecha_fin'] = 'nullable|date|after_or_equal:fecha_inicio';
        }

        $datosValidados = $request->validate($reglas);

        $servicio = Servicio::create($datosValidados);

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

        $reglas = [
            'nombre' => 'sometimes|string|max:200',
            'tipo_servicio' => 'sometimes|in:paquete_turistico,hotel,vuelo,excursion,transporte,actividad,otros',
            'precio' => 'sometimes|numeric|min:0',
            'descripcion' => 'sometimes|nullable|string',
            'destino' => 'sometimes|nullable|string|max:150',
            'disponibilidad' => 'sometimes|integer|min:0',
            'duracion_dias' => 'sometimes|nullable|integer|min:0',
            'imagen_url' => 'sometimes|nullable|url|max:255',
            'fecha_inicio' => 'sometimes|nullable|date',
            'fecha_fin' => 'sometimes|nullable|date',
            'estado' => 'sometimes|in:activo,inactivo,agotado'
        ];

        if ($request->filled('fecha_fin')) {
            if ($request->has('fecha_inicio')) {
                $fechaInicioReferencia = $request->input('fecha_inicio');
            } else {
                $fechaInicioReferencia = $servicio->fecha_inicio ? $servicio->fecha_inicio->format('Y-m-d') : null;
            }

            if ($fechaInicioReferencia) {
                $reglas['fecha_fin'] = 'sometimes|nullable|date|after_or_equal:' . $fechaInicioReferencia;
            }
        }

        $datosValidados = $request->validate($reglas);

        $servicio->update($datosValidados);

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

        $servicio->update([
            'estado' => 'inactivo'
        ]);

        // Registrar auditoría antes de eliminar
        AuditoriaContenido::create([
            'id_administrador' => $request->user()->id_usuario,
            'id_servicio' => $servicio->id_servicio,
            'accion' => 'eliminar',
            'datos_anteriores' => $datosAnteriores,
            'datos_nuevos' => $servicio->toArray()
        ]);

        return response()->json([
            'message' => 'Servicio desactivado exitosamente'
        ]);
    }
}
