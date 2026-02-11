<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Servicio extends Model
{
    protected $table = 'servicios';
    protected $primaryKey = 'id_servicio';
    public $timestamps = false;

    protected $fillable = [
        'nombre',
        'descripcion',
        'tipo_servicio',
        'destino',
        'precio',
        'disponibilidad',
        'duracion_dias',
        'imagen_url',
        'fecha_inicio',
        'fecha_fin',
        'estado'
    ];

    protected $casts = [
        'precio' => 'decimal:2',
        'fecha_inicio' => 'date',
        'fecha_fin' => 'date'
    ];

    // Relaciones
    public function carrito()
    {
        return $this->hasMany(Carrito::class, 'id_servicio');
    }

    public function detallesPedido()
    {
        return $this->hasMany(DetallePedido::class, 'id_servicio');
    }

    public function auditorias()
    {
        return $this->hasMany(AuditoriaContenido::class, 'id_servicio');
    }

    // Scope para servicios activos
    public function scopeActivos($query)
    {
        return $query->where('estado', 'activo');
    }

    // Verificar disponibilidad
    public function estaDisponible()
    {
        return $this->estado === 'activo' && $this->disponibilidad > 0;
    }
}