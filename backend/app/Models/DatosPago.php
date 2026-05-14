<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DatosPago extends Model
{
    protected $table = 'pagos';
    protected $primaryKey = 'id_pago';
    public $timestamps = false;

    protected $fillable = [
        'id_pedido',
        'proveedor',
        'referencia_externa',
        'monto',
        'moneda',
        'estado_transaccion',
        'fecha_pago'
    ];

    protected $casts = [
        'monto' => 'decimal:2',
        'fecha_pago' => 'datetime',
        'creado_en' => 'datetime'
    ];

    // Relaciones
    public function pedido()
    {
        return $this->belongsTo(Pedido::class, 'id_pedido');
    }
}
