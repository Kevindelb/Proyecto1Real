<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Factura extends Model
{
    protected $table = 'facturas';
    protected $primaryKey = 'id_factura';
    public $timestamps = false;

    protected $fillable = [
        'id_pedido',
        'numero_factura',
        'email_enviado',
        'fecha_envio_email',
        'ruta_pdf'
    ];

    protected $casts = [
        'fecha_emision' => 'datetime',
        'fecha_envio_email' => 'datetime',
        'email_enviado' => 'boolean'
    ];

    // Relaciones
    public function pedido()
    {
        return $this->belongsTo(Pedido::class, 'id_pedido');
    }

    // Generar número de factura
    public static function generarNumeroFactura()
    {
        $year = date('Y');
        $ultimaFactura = self::where('numero_factura', 'like', "FAC-{$year}-%")
                            ->orderBy('id_factura', 'desc')
                            ->first();
        
        if ($ultimaFactura) {
            $numero = intval(substr($ultimaFactura->numero_factura, -5)) + 1;
        } else {
            $numero = 1;
        }
        
        return "FAC-{$year}-" . str_pad($numero, 5, '0', STR_PAD_LEFT);
    }
}