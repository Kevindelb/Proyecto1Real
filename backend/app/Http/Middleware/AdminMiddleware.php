<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AdminMiddleware
{
    // verificar si el usuario autenticado es administrador
    public function handle(Request $request, Closure $next)
    {
        // verificar si el usuario está autenticado
        if (!$request->user()) {
            return response()->json([
                'message' => 'No autenticado'
            ], 401);
        }

        // verificar si es administrador
        if (!$request->user()->isAdmin()) {
            return response()->json([
                'message' => 'Acceso denegado. Solo administradores'
            ], 403);
        }

        return $next($request);
    }
}
