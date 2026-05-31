<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /* Registrar nuevo usuario --------------- POST /api/register */
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

    // Iniciar sesion ..... POST /api/login 
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

    /* Obtener usuario autenticado ---- GET /api/user */
    public function user(Request $request)
    {
        return response()->json($request->user());
    }

    /* Cerrar sesión ---- POST /api/logout */
    public function logout(Request $request)
    {
        // Eliminar token actual
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Sesión cerrada exitosamente'
        ]);
    }

    /* Actualizar perfil del usuario autenticado  ------ PUT /api/user/profile */
    public function updateProfile(Request $request)
    {
        $usuario = $request->user();

        $request->validate([
            'nombre' => 'required|string|max:100',
            'apellidos' => 'required|string|max:100',
            'email' => 'required|email|unique:usuarios,email,' . $usuario->id_usuario . ',id_usuario',
            'telefono' => 'nullable|string|max:20'
        ]);

        $usuario->update($request->only(['nombre', 'apellidos', 'email', 'telefono']));

        return response()->json([
            'message' => 'Perfil actualizado exitosamente',
            'user' => $usuario
        ]);
    }

    /* Actualizar contraseña del usuario autenticado .... PUT /api/user/password */
    public function updatePassword(Request $request)
    {
        $usuario = $request->user();

        $request->validate([
            'password_actual' => 'required|string',
            'password_nuevo' => 'required|string|min:6|confirmed'
        ]);

        if (!Hash::check($request->password_actual, $usuario->password)) {
            throw ValidationException::withMessages([
                'password_actual' => ['La contraseña actual es incorrecta']
            ]);
        }

        $usuario->password = Hash::make($request->password_nuevo);
        $usuario->save();

        return response()->json([
            'message' => 'Contraseña actualizada exitosamente'
        ]);
    }
}
