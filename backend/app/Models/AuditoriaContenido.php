<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AuditoriaContenido extends Model
{
    protected $table = 'auditoria_contenido';
    protected $primaryKey = 'id_auditoria';
    public $timestamps = false;

    protected $fillable = [
        'id_administrador',
        'id_servicio',
        'accion',
        'datos_anteriores',
        'datos_nuevos'
    ];

    protected $casts = [
        'fecha_accion' => 'datetime',
        'datos_anteriores' => 'array',
        'datos_nuevos' => 'array'
    ];

    // Relaciones
    public function administrador()
    {
        return $this->belongsTo(Usuario::class, 'id_administrador');
    }

    public function servicio()
    {
        return $this->belongsTo(Servicio::class, 'id_servicio');
    }
}
