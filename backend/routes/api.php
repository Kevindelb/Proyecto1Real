<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CarritoController;
use App\Http\Controllers\PedidoController;
use App\Http\Controllers\ServicioController;
use Termwind\Components\Raw;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

//rUtas sin autenticacion 

//registrat/entrar

Route::post('/register',[AuthController::class, 'register']);
Route::post('/login',[AuthController::class, 'login']);

//para ver catalogos 

Route::get('/servicios',[ServicioController::class, 'index']);
Route::get('/servicios/{id}', [ServicioController::class, 'show']);


//Rutas con autenticacionnnn

Route::middleware('auth:sanctum')->group(function () {
    
    // ========================================
    // AUTENTICACIÓN
    // ========================================
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);

    
    // ========================================
    // CARRITO
    // ========================================
    Route::get('/carrito', [CarritoController::class, 'index']);
    Route::post('/carrito', [CarritoController::class, 'store']);
    Route::put('/carrito/{id}', [CarritoController::class, 'update']);
    Route::delete('/carrito/{id}', [CarritoController::class, 'destroy']);
    Route::delete('/carrito', [CarritoController::class, 'clear']);

    
    // ========================================
    // PEDIDOS
    // ========================================
    Route::get('/pedidos', [PedidoController::class, 'index']);
    Route::post('/pedidos', [PedidoController::class, 'store']);
    Route::get('/pedidos/{id}', [PedidoController::class, 'show']);

    
    // ========================================
    // RUTAS SOLO PARA ADMINISTRADORES
    // ========================================
    Route::middleware(\App\Http\Middleware\AdminMiddleware::class)->group(function () {
        
        // SERVICIOS (CRUD admin)
        Route::post('/servicios', [ServicioController::class, 'store']);
        Route::put('/servicios/{id}', [ServicioController::class, 'update']);
        Route::delete('/servicios/{id}', [ServicioController::class, 'destroy']);
        
        // PEDIDOS (gestión admin)
        Route::put('/pedidos/{id}/estado', [PedidoController::class, 'updateEstado']);
    });
});