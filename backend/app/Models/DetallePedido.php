<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DetallePedido extends Model
{
    protected $table = 'detalle_pedido';
    protected $primaryKey = 'id_detalle';
    public $timestamps = false;

    protected $fillable = [
        'id_pedido',
        'id_servicio',
        'cantidad',
        'precio_unitario',
        'subtotal',
        'fecha_viaje',
        'num_personas'
    ];

    protected $casts = [
        'precio_unitario' => 'decimal:2',
        'subtotal' => 'decimal:2',
        'fecha_viaje' => 'date'
    ];

    // Relaciones
    public function pedido()
    {
        return $this->belongsTo(Pedido::class, 'id_pedido');
    }

    public function servicio()
    {
        return $this->belongsTo(Servicio::class, 'id_servicio');
    }
}
