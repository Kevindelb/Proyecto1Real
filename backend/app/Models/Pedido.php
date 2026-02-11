<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pedido extends Model
{
    protected $table = 'pedidos';
    protected $primaryKey = 'id_pedido';
    public $timestamps = false;

    protected $fillable = [
        'id_usuario',
        'total',
        'estado_pedido',
        'metodo_pago',
        'estado_pago'
    ];

    protected $casts = [
        'total' => 'decimal:2',
        'fecha_pedido' => 'datetime'
    ];

    // Relaciones
    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'id_usuario');
    }

    public function detalles()
    {
        return $this->hasMany(DetallePedido::class, 'id_pedido');
    }

    public function datosPago()
    {
        return $this->hasOne(DatosPago::class, 'id_pedido');
    }

    public function factura()
    {
        return $this->hasOne(Factura::class, 'id_pedido');
    }

    // Scopes
    public function scopePendientes($query)
    {
        return $query->where('estado_pedido', 'pendiente');
    }

    public function scopeConfirmados($query)
    {
        return $query->where('estado_pedido', 'confirmado');
    }

    // Verificar si está pagado
    public function estaPagado()
    {
        return $this->estado_pago === 'aprobado';
    }
}
