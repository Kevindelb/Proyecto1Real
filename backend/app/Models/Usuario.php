<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Usuario extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $table = 'usuarios';
    protected $primaryKey = 'id_usuario';
    public $timestamps = false;

    protected $fillable = [
        'nombre',
        'apellidos',
        'email',
        'password',
        'telefono',
        'estado',
        'tipo_usuario'
    ];

    protected $hidden = [
        'password'
    ];

    // Relaciones
    public function carrito()
    {
        return $this->hasMany(Carrito::class, 'id_usuario');
    }

    public function pedidos()
    {
        return $this->hasMany(Pedido::class, 'id_usuario');
    }


    // Verificar si es administrador
    public function isAdmin()
    {
        return $this->tipo_usuario === 'administrador';
    }
}