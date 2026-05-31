<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UsuarioController extends Controller
{
    /** Listar todos los usuarios ---GET /api/admin/usuarios  */
    public function index()
    {
        $usuarios = Usuario::orderBy('fecha_registro', 'desc')->get();
        return response()->json($usuarios);
    }

    /* Crear nuevo usuario (solo admin)  POST /api/admin/usuario  */
    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:100',
            'apellidos' => 'required|string|max:100',
            'email' => 'required|email|unique:usuarios,email',
            'password' => 'required|string|min:6',
            'telefono' => 'nullable|string|max:20',
            'estado' => 'nullable|in:activo,inactivo,suspendido',
            'tipo_usuario' => 'required|in:cliente,administrador'
        ]);

        $usuario = Usuario::create([
            'nombre' => $request->nombre,
            'apellidos' => $request->apellidos,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'telefono' => $request->telefono,
            'estado' => $request->estado ?? 'activo',
            'tipo_usuario' => $request->tipo_usuario,
            'fecha_registro' => now()
        ]);

        return response()->json([
            'message' => 'Usuario creado exitosamente',
            'usuario' => $usuario
        ], 201);
    }

    /*  Obtener un usuario específico ----- GET /api/admin/usuarios/{id  */
    public function show($id)
    {
        $usuario = Usuario::findOrFail($id);
        return response()->json($usuario);
    }

    /*  Actualizar usuario (solo admin) ---------- PUT /api/admin/usuarios/{id} */
    public function update(Request $request, $id)
    {
        $usuario = Usuario::findOrFail($id);

        $request->validate([
            'nombre' => 'sometimes|required|string|max:100',
            'apellidos' => 'sometimes|required|string|max:100',
            'email' => [
                'sometimes',
                'required',
                'email',
                Rule::unique('usuarios', 'email')->ignore($usuario->id_usuario, 'id_usuario')
            ],
            'password' => 'nullable|string|min:6',
            'telefono' => 'nullable|string|max:20',
            'estado' => 'sometimes|required|in:activo,inactivo,suspendido',
            'tipo_usuario' => 'sometimes|required|in:cliente,administrador'
        ]);

        $datos = $request->only(['nombre', 'apellidos', 'email', 'telefono', 'estado', 'tipo_usuario']);

        if ($request->filled('password')) {
            $datos['password'] = Hash::make($request->password);
        }

        $usuario->update($datos);

        return response()->json([
            'message' => 'Usuario actualizado exitosamente',
            'usuario' => $usuario
        ]);
    }

    /* Eliminar usuario (solo admin ------------ DELETE /api/admin/usuarios/{id */
    public function destroy($id)
    {
        $usuario = Usuario::findOrFail($id);
        
        // Evitar que el administrador se elimine a sí mismo
        if (auth('sanctum')->user()->id_usuario === $usuario->id_usuario) {
            return response()->json([
                'message' => 'No puedes eliminar tu propia cuenta de administrador'
            ], 400);
        }

        $usuario->delete();

        return response()->json([
            'message' => 'Usuario eliminado exitosamente'
        ]);
    }
}
