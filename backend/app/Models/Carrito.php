<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Carrito extends Model
{
    protected $table = 'carrito';
    protected $primaryKey = 'id_carrito';
    public $timestamps = false;

    protected $fillable = [
        'id_usuario',
        'id_servicio',
        'cantidad',
        'fecha_viaje',
        'num_personas',
        'observaciones'
    ];

    protected $casts = [
        'fecha_viaje' => 'date'
    ];

    // Relaciones
    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'id_usuario');
    }

    public function servicio()
    {
        return $this->belongsTo(Servicio::class, 'id_servicio');
    }

    // Calcular subtotal
    public function getSubtotalAttribute()
    {
        return $this->cantidad * $this->servicio->precio;
    }
}