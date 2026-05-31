import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '../../components/ui/sheet';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { 
    Search, 
    Eye, 
    Loader2, 
    Calendar, 
    Clock, 
    CreditCard, 
    User, 
    FileText, 
    CheckCircle2, 
    ShieldAlert, 
    AlertCircle 
} from 'lucide-react';

function OrdersManagement() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // drawer de detalles
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    
    // guardado de estado
    const [updatingOrderId, setUpdatingOrderId] = useState(null);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await api.get('/admin/pedidos');
            setOrders(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error al obtener pedidos:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusChange = async (orderId, newStatus) => {
        setUpdatingOrderId(orderId);
        try {
            await api.put(`/pedidos/${orderId}/estado`, {
                estado_pedido: newStatus
            });
            
            // actualizar lista local
            setOrders(prev => prev.map(o => 
                o.id_pedido === orderId ? { ...o, estado_pedido: newStatus } : o
            ));

            // si está abierto en el Drawer, actualizarlo también
            if (selectedOrder && selectedOrder.id_pedido === orderId) {
                setSelectedOrder(prev => ({ ...prev, estado_pedido: newStatus }));
            }
        } catch (error) {
            console.error('Error al actualizar estado:', error);
        } finally {
            setUpdatingOrderId(null);
        }
    };

    const openDetailsSheet = (order) => {
        setSelectedOrder(order);
        setIsSheetOpen(true);
    };

    // filtros localmente
    const filteredOrders = orders.filter(order => {
        const matchesStatus = statusFilter === 'all' || order.estado_pedido === statusFilter;
        
        const customerName = `${order.usuario?.nombre || ''} ${order.usuario?.apellidos || ''}`.toLowerCase();
        const customerEmail = (order.usuario?.email || '').toLowerCase();
        const orderId = `#ped-${order.id_pedido}`.toLowerCase();
        
        const matchesQuery = 
            customerName.includes(searchQuery.toLowerCase()) || 
            customerEmail.includes(searchQuery.toLowerCase()) || 
            orderId.includes(searchQuery.toLowerCase());
            
        return matchesStatus && matchesQuery;
    });

    const getStatusColor = (status) => {
        switch(status) {
            case 'confirmado':
            case 'completado':
                return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'pendiente':
            case 'procesando':
                return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            case 'cancelado':
                return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
            default:
                return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
        }
    };

    const getPaymentStatusColor = (status) => {
        switch(status) {
            case 'aprobado':
                return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
            case 'pendiente':
                return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
            case 'rechazado':
            case 'reembolsado':
                return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
            default:
                return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* cabecera del carrito  */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white">Reservas y Pedidos</h1>
                <p className="text-slate-400 text-sm">Gestiona y haz seguimiento de las reservas de viajes realizadas por tus clientes.</p>
            </div>

            {/* filtros  */}
            <Card className="border-slate-800 bg-slate-900/40 text-slate-100 shadow-md">
                <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:max-w-md">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                        <Input 
                            placeholder="Buscar por ID Pedido, Cliente o Email..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 bg-slate-950 border-slate-800 text-white placeholder:text-slate-500 focus-visible:ring-primary"
                        />
                    </div>
                    
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider shrink-0">Filtrar Estado:</span>
                        <select 
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="bg-slate-950 border border-slate-800 text-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-slate-700 w-full md:w-48"
                        >
                            <option value="all">Todos los estados</option>
                            <option value="pendiente">Pendiente</option>
                            <option value="confirmado">Confirmado</option>
                            <option value="procesando">Procesando</option>
                            <option value="completado">Completado</option>
                            <option value="cancelado">Cancelado</option>
                        </select>
                    </div>
                </CardContent>
            </Card>

            {/* listado de pedidos  */}
            {loading ? (
                <div className="h-[40vh] flex flex-col items-center justify-center gap-4 text-slate-400">
                    <Loader2 className="w-8 h-8 animate-spin text-white" />
                    <p className="text-sm">Analizando e importando reservas...</p>
                </div>
            ) : (
                <Card className="border-slate-800 bg-slate-900/40 text-slate-100 shadow-md">
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-slate-350">
                                <thead className="text-xs text-slate-400 uppercase bg-slate-900/60 border-b border-slate-800">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold">ID Reserva</th>
                                        <th className="px-6 py-4 font-semibold">Cliente</th>
                                        <th className="px-6 py-4 font-semibold">Fecha Reserva</th>
                                        <th className="px-6 py-4 font-semibold text-right">Total</th>
                                        <th className="px-6 py-4 font-semibold text-center">Estado Pago</th>
                                        <th className="px-6 py-4 font-semibold text-center">Estado Reserva</th>
                                        <th className="px-6 py-4 font-semibold text-center">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/50">
                                    {filteredOrders.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-12 text-center text-slate-500">
                                                No se encontraron reservas con los filtros aplicados.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredOrders.map(order => (
                                            <tr key={order.id_pedido} className="hover:bg-slate-850/30 transition-colors">
                                                <td className="px-6 py-4 font-mono font-medium text-white">#PED-{order.id_pedido}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-white">{order.usuario?.nombre} {order.usuario?.apellidos}</span>
                                                        <span className="text-xs text-slate-500">{order.usuario?.email}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                                        <Calendar className="w-3.5 h-3.5" />
                                                        {order.fecha_pedido && !isNaN(new Date(order.fecha_pedido).getTime()) ? (
                                                            new Date(order.fecha_pedido).toLocaleDateString(undefined, {
                                                                year: 'numeric',
                                                                month: 'short',
                                                                day: 'numeric',
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })
                                                        ) : 'N/A'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right font-extrabold text-white">
                                                    €{parseFloat(order.total).toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${getPaymentStatusColor(order.estado_pago || 'pendiente')}`}>
                                                        {order.estado_pago || 'pendiente'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    {updatingOrderId === order.id_pedido ? (
                                                        <Loader2 className="w-4 h-4 animate-spin text-slate-400 mx-auto" />
                                                    ) : (
                                                        <select 
                                                            value={order.estado_pedido}
                                                            onChange={(e) => handleStatusChange(order.id_pedido, e.target.value)}
                                                            className={`text-xs font-semibold px-2 py-1 rounded-md border bg-slate-950 uppercase ${getStatusColor(order.estado_pedido)} outline-none cursor-pointer focus:border-slate-650`}
                                                        >
                                                            <option value="pendiente">Pendiente</option>
                                                            <option value="confirmado">Confirmado</option>
                                                            <option value="procesando">Procesando</option>
                                                            <option value="completado">Completado</option>
                                                            <option value="cancelado">Cancelado</option>
                                                        </select>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <Button 
                                                        variant="ghost" 
                                                        size="sm" 
                                                        onClick={() => openDetailsSheet(order)}
                                                        className="text-slate-450 hover:text-white text-xs gap-1.5 hover:bg-slate-800/60"
                                                    >
                                                        <Eye className="w-3.5 h-3.5" />
                                                        <span>Detalles</span>
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* drawer detallado de reserva  */}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent className="bg-slate-900 border-slate-850 text-white max-w-md w-full overflow-y-auto">
                    <SheetHeader className="border-b border-slate-800/80 pb-4">
                        <SheetTitle className="text-xl font-bold text-white flex items-center gap-2">
                            Detalles de Reserva
                        </SheetTitle>
                        <SheetDescription className="text-slate-400 text-xs font-mono">
                            ID: #PED-{selectedOrder?.id_pedido}
                        </SheetDescription>
                    </SheetHeader>

                    {selectedOrder && (
                        <div className="space-y-6 py-4">
                            {/* estado general  */}
                            <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/40 space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-450">Estado Reserva:</span>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border uppercase ${getStatusColor(selectedOrder.estado_pedido)}`}>
                                        {selectedOrder.estado_pedido}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-450">Método Pago:</span>
                                    <span className="uppercase text-xs text-white font-medium">
                                        {selectedOrder.metodo_pago?.replace('_', ' ')}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-450">Estado Pago:</span>
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${getPaymentStatusColor(selectedOrder.estado_pago || 'pendiente')}`}>
                                        {selectedOrder.estado_pago || 'pendiente'}
                                    </span>
                                </div>
                            </div>

                            {/* Información Cliente */}
                            <div className="space-y-3">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                                    <User className="w-3.5 h-3.5" />
                                    Información del Cliente
                                </h3>
                                <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/30 text-sm space-y-2">
                                    <div>Nombre: <strong className="text-white">{selectedOrder.usuario?.nombre} {selectedOrder.usuario?.apellidos}</strong></div>
                                    <div>Email: <span className="text-slate-350">{selectedOrder.usuario?.email}</span></div>
                                    <div>Teléfono: <span className="text-slate-350">{selectedOrder.usuario?.telefono || 'No provisto'}</span></div>
                                </div>
                            </div>

                            {/* Artículos Reservados */}
                            <div className="space-y-3">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                                    <Clock className="w-3.5 h-3.5" />
                                    Itinerarios y Servicios Reservados
                                </h3>
                                <div className="space-y-3">
                                    {selectedOrder.detalles?.map((det, index) => (
                                        <div key={index} className="p-4 rounded-xl border border-slate-800 bg-slate-950/40 space-y-3">
                                            <div className="flex justify-between items-start gap-2">
                                                <h4 className="font-semibold text-white text-sm leading-snug">{det.servicio?.nombre}</h4>
                                                <span className="text-slate-400 font-mono text-xs shrink-0">€{parseFloat(det.precio_unitario).toFixed(2)}</span>
                                            </div>
                                            <div className="text-xs text-slate-400 space-y-1">
                                                <div className="flex justify-between">
                                                    <span>Pasajeros:</span>
                                                    <strong className="text-slate-300">{det.num_personas} {det.num_personas > 1 ? 'Personas' : 'Persona'}</strong>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Fecha de viaje:</span>
                                                    <strong className="text-slate-300">
                                                        {det.fecha_viaje && !isNaN(new Date(det.fecha_viaje).getTime()) ? (
                                                            new Date(det.fecha_viaje).toLocaleDateString(undefined, {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric'
                                                            })
                                                        ) : 'No seleccionada'}
                                                    </strong>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Cantidad items:</span>
                                                    <strong className="text-slate-300">{det.cantidad}</strong>
                                                </div>
                                            </div>
                                            <div className="border-t border-slate-850 pt-2 flex justify-between items-center text-xs font-bold text-white">
                                                <span>Subtotal:</span>
                                                <span>€{parseFloat(det.subtotal).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Facturación y Pagos Transacción */}
                            {(selectedOrder.factura || selectedOrder.datos_pago) && (
                                <div className="space-y-3">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                                        <FileText className="w-3.5 h-3.5" />
                                        Información Fiscal y Transaccional
                                    </h3>
                                    <div className="p-4 rounded-xl border border-slate-805 bg-slate-950/30 text-xs space-y-2 text-slate-400">
                                        {selectedOrder.factura && (
                                            <div className="flex justify-between">
                                                <span>Factura N°:</span>
                                                <strong className="text-white">{selectedOrder.factura.numero_factura}</strong>
                                            </div>
                                        )}
                                        {selectedOrder.datos_pago && (
                                            <>
                                                <div className="flex justify-between">
                                                    <span>Referencia de Pago:</span>
                                                    <strong className="text-white font-mono">{selectedOrder.datos_pago.referencia_externa}</strong>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Proveedor Pago:</span>
                                                    <strong className="text-white uppercase">{selectedOrder.datos_pago.proveedor}</strong>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* importe total de la reserva  */}
                            <div className="border-t border-slate-800 pt-4 flex items-center justify-between text-base">
                                <span className="font-bold text-slate-350">Monto Cobrado Total:</span>
                                <span className="font-extrabold text-white text-xl">€{parseFloat(selectedOrder.total).toFixed(2)}</span>
                            </div>
                        </div>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    );
}

export default OrdersManagement;
