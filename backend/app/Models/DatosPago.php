<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DatosPago extends Model
{
    protected $table = 'datos_pago';
    protected $primaryKey = 'id_pago';
    public $timestamps = false;

    protected $fillable = [
        'id_pedido',
        'nombre_titular',
        'numero_tarjeta_encriptado',
        'tipo_tarjeta',
        'codigo_autorizacion',
        'estado_transaccion',
        'mensaje_banco'
    ];

    protected $hidden = [
        'numero_tarjeta_encriptado'
    ];

    protected $casts = [
        'fecha_transaccion' => 'datetime'
    ];

    // Relaciones
    public function pedido()
    {
        return $this->belongsTo(Pedido::class, 'id_pedido');
    }
}
