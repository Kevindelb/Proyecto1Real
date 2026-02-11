<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Registrar nuevo usuario
     * POST /api/register
     */
    public function register(Request $request)
    {
        // Validar datos
        $request->validate([
            'nombre' => 'required|string|max:100',
            'apellidos' => 'required|string|max:100',
            'email' => 'required|email|unique:usuarios,email',
            'password' => 'required|string|min:6',
            'telefono' => 'nullable|string|max:20'
        ]);

        // Crear usuario
        $usuario = Usuario::create([
            'nombre' => $request->nombre,
            'apellidos' => $request->apellidos,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'telefono' => $request->telefono,
            'tipo_usuario' => 'cliente',
            'estado' => 'activo'
        ]);

        // Generar token
        $token = $usuario->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Usuario registrado exitosamente',
            'user' => $usuario,
            'access_token' => $token,
            'token_type' => 'Bearer'
        ], 201);
    }

    /**
     * Iniciar sesión
     * POST /api/login
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        // Buscar usuario
        $usuario = Usuario::where('email', $request->email)->first();

        // Verificar credenciales
        if (!$usuario || !Hash::check($request->password, $usuario->password)) {
            throw ValidationException::withMessages([
                'email' => ['Las credenciales son incorrectas']
            ]);
        }

        // Verificar estado del usuario
        if ($usuario->estado !== 'activo') {
            return response()->json([
                'message' => 'Usuario inactivo o suspendido'
            ], 403);
        }

        // Actualizar último acceso
        $usuario->ultimo_acceso = now();
        $usuario->save();

        // Generar token
        $token = $usuario->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Inicio de sesión exitoso',
            'user' => $usuario,
            'access_token' => $token,
            'token_type' => 'Bearer'
        ]);
    }

    /**
     * Obtener usuario autenticado
     * GET /api/user
     */
    public function user(Request $request)
    {
        return response()->json($request->user());
    }

    /**
     * Cerrar sesión
     * POST /api/logout
     */
    public function logout(Request $request)
    {
        // Eliminar token actual
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Sesión cerrada exitosamente'
        ]);
    }
}
