import { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Users,
  ShoppingBag,
  Search,
  User,
  FileText,
  TrendingUp,
  ArrowRight,
  Clock,
  DollarSign,
  ShieldCheck,
  ChevronRight,
  AlertCircle,
  HelpCircle,
  Briefcase
} from 'lucide-react';

export default function MisReservas() {
  const { user, token, loading: authLoading, isAdmin } = useAuth();
  const navigate = useNavigate();

  //  estado para clientes
  const [clientOrders, setClientOrders] = useState([]);
  const [clientLoading, setClientLoading] = useState(true);

  // estado para administradores
  const [adminOrders, setAdminOrders] = useState([]);
  const [adminLoading, setAdminLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);

  // redirige si no esta logueado
  useEffect(() => {
    if (!authLoading && !token) {
      navigate('/login');
    }
  }, [token, authLoading, navigate]);

  //  carga las ordenes para clientes
  useEffect(() => {
    const fetchClientOrders = async () => {
      if (token && user && user.tipo_usuario !== 'administrador') {
        setClientLoading(true);
        try {
          const response = await api.get('/pedidos');
          setClientOrders(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
          console.error('Error al cargar reservas de cliente:', error);
        } finally {
          setClientLoading(false);
        }
      }
    };
    fetchClientOrders();
  }, [token, user]);

  //  carga las ordenes para administradores
  useEffect(() => {
    const fetchAdminOrders = async () => {
      if (token && user && user.tipo_usuario === 'administrador') {
        setAdminLoading(true);
        try {
          const response = await api.get('/admin/pedidos');
          setAdminOrders(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
          console.error('Error al cargar reservas de administrador:', error);
        } finally {
          setAdminLoading(false);
        }
      }
    };
    fetchAdminOrders();
  }, [token, user]);

  //  muestra imagen en caso de que no se tenga
  const getServiceFallbackImage = (service, idx) => {
    if (service?.imagen_url && service.imagen_url.trim() !== '') {
      return service.imagen_url;
    }
    return 'http://127.0.0.1:8000/storage/servicios/no%20hay%20imagen.webp';
  };

  //  obtiene clases de estado de pedido
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'confirmado':
      case 'completado':
        return 'bg-emerald-50 border-emerald-250 text-emerald-800';
      case 'pendiente':
      case 'procesando':
        return 'bg-amber-50 border-amber-250 text-amber-800';
      case 'cancelado':
        return 'bg-rose-50 border-rose-250 text-rose-800';
      default:
        return 'bg-neutral-50 border-neutral-250 text-neutral-800';
    }
  };

  const getPaymentBadgeClass = (status) => {
    switch (status) {
      case 'aprobado':
        return 'bg-emerald-50 border-emerald-250 text-emerald-800';
      case 'pendiente':
        return 'bg-amber-50 border-amber-250 text-amber-800';
      case 'rechazado':
        return 'bg-rose-50 border-rose-250 text-rose-800';
      default:
        return 'bg-neutral-50 border-neutral-250 text-neutral-800';
    }
  };


  //  cálculos y agrupaciones
  // agrupa las ordenes por cliente
  const customersMap = {};
  adminOrders.forEach(order => {
    const customer = order.usuario;
    if (!customer) return;
    const cid = customer.id_usuario;
    if (!customersMap[cid]) {
      customersMap[cid] = {
        id_usuario: cid,
        nombre: customer.nombre,
        apellidos: customer.apellidos,
        email: customer.email,
        telefono: customer.telefono || 'No registrado',
        fecha_registro: customer.fecha_registro,
        orders: [],
        totalSpent: 0
      };
    }
    customersMap[cid].orders.push(order);
    customersMap[cid].totalSpent += parseFloat(order.total || 0);
  });

  const customersList = Object.values(customersMap);

  //  filtra los clientes por busqueda
  const filteredCustomers = customersList.filter(c => {
    const query = searchQuery.toLowerCase();
    const fullName = `${c.nombre} ${c.apellidos}`.toLowerCase();
    const email = c.email.toLowerCase();
    return fullName.includes(query) || email.includes(query);
  });

  //  obtiene el cliente seleccionado
  const selectedCustomer = selectedCustomerId ? customersMap[selectedCustomerId] : null;

  //  calcula el total gastado por el cliente
  const clientTotalSpent = clientOrders.reduce((sum, o) => sum + parseFloat(o.total || 0), 0);
  const clientActiveBookings = clientOrders.filter(o => o.estado_pedido === 'confirmado' || o.estado_pedido === 'procesando').length;

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans" style={{ fontFamily: "'Outfit', sans-serif" }}>
      <Header />

      {/*  Sección Hero */}
      <div className="relative h-[40vh] sm:h-[45vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=1200"
            alt="Mis Reservas"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/45" />
        </div>
        <div className="relative z-10 text-center text-white px-4 mt-16 animate-in fade-in zoom-in-95 duration-500">
          <span className="text-[11px] font-black tracking-widest text-[#84cc16] uppercase">
            {isAdmin() ? 'PANEL DE CONTROL' : 'TU BITÁCORA'}
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-wide uppercase mt-1">
            {isAdmin() ? 'Reservas por Cliente' : 'Mis Reservas'}
          </h1>
          <p className="text-neutral-300 text-xs sm:text-sm mt-2 max-w-xl mx-auto font-light leading-relaxed">
            {isAdmin()
              ? 'Analiza y visualiza en detalle las compras e itinerarios realizados por cada uno de tus clientes registrados.'
              : 'Revisa tus viajes confirmados, traslados, hoteles y descárgate las referencias de pago de tus reservas.'}
          </p>
        </div>
      </div>

      {/* area de contenido principal  */}
      <main className="flex-grow py-12 px-6 sm:px-12 lg:px-8 max-w-7xl mx-auto w-full">
        {authLoading ? (
          <div className="h-[40vh] flex flex-col items-center justify-center gap-3 text-neutral-500">
            <div className="w-8 h-8 border-3 border-[#0d5638] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs sm:text-sm">Autenticando credenciales de usuario...</p>
          </div>
        ) : isAdmin() ? (
          // vista del administrador: agrupado por cliente
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* columna izquierda: lista de clientes  */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-3xl border border-neutral-100 p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-[#062e20]">Clientes Registrados</h2>
                  <span className="bg-[#0d5638]/10 text-[#0d5638] text-xs font-black px-2.5 py-0.5 rounded-full">
                    {customersList.length} total
                  </span>
                </div>

                {/*  input de busqueda de cliente  */}
                <div className="relative">
                  <Search className="absolute left-3.5 top-3 w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Buscar por cliente o email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm bg-neutral-50/50 outline-none focus:bg-white focus:border-[#0d5638] transition-all font-medium text-slate-800 placeholder:text-neutral-400"
                  />
                </div>

                {/*  lista de clientes  */}
                {adminLoading ? (
                  <div className="py-12 text-center text-xs text-neutral-450 space-y-2">
                    <div className="w-6 h-6 border-2 border-[#0d5638] border-t-transparent rounded-full animate-spin mx-auto" />
                    <span>Cargando clientes de travel_and_routes...</span>
                  </div>
                ) : filteredCustomers.length === 0 ? (
                  <div className="py-12 text-center text-xs text-neutral-400">
                    No se encontraron clientes que coincidan con la búsqueda.
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                    {filteredCustomers.map(customer => {
                      const isActive = selectedCustomerId === customer.id_usuario;
                      return (
                        <button
                          key={customer.id_usuario}
                          onClick={() => setSelectedCustomerId(customer.id_usuario)}
                          className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between cursor-pointer ${isActive
                            ? 'border-[#0d5638] bg-[#0d5638]/5 shadow-xs'
                            : 'border-neutral-100 bg-white hover:border-neutral-200 hover:shadow-xs'
                            }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${isActive ? 'bg-[#0d5638] text-white' : 'bg-neutral-100 text-[#062e20]'
                              }`}>
                              {customer.nombre[0].toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-xs sm:text-sm font-bold text-[#062e20] leading-tight truncate">
                                {customer.nombre} {customer.apellidos}
                              </h4>
                              <p className="text-[10px] text-neutral-400 font-light truncate mt-0.5">
                                {customer.email}
                              </p>
                            </div>
                          </div>
                          <div className="text-right shrink-0 pl-2">
                            <span className="text-[10px] bg-neutral-100 text-neutral-600 font-extrabold py-0.5 px-2 rounded-full block text-center mb-1">
                              {customer.orders.length} {customer.orders.length === 1 ? 'reserva' : 'reservas'}
                            </span>
                            <span className="text-xs font-black text-[#0d5638]">
                              ${customer.totalSpent.toFixed(2)}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/*  columna derecha: detalle de reservas del cliente seleccionado  */}
            <div className="lg:col-span-7">
              {selectedCustomer ? (
                <div className="space-y-6">

                  {/*  tarjeta de perfil del cliente  */}
                  <div className="bg-white rounded-3xl border border-neutral-100 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-[#0d5638] text-white flex items-center justify-center text-lg font-black border border-[#0d5638]/10 shadow-md">
                        {selectedCustomer.nombre[0].toUpperCase()}{selectedCustomer.apellidos[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg sm:text-xl font-black text-[#062e20]">
                            {selectedCustomer.nombre} {selectedCustomer.apellidos}
                          </h3>
                          <span className="text-[10px] bg-[#84cc16]/10 text-[#0d5638] font-bold py-0.5 px-2.5 rounded-full">
                            Cliente #{selectedCustomer.id_usuario}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-500 font-light mt-0.5">
                          {selectedCustomer.email} • Tel: {selectedCustomer.telefono}
                        </p>
                      </div>
                    </div>
                    <div className="text-left sm:text-right shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-neutral-100">
                      <span className="text-[10px] text-neutral-450 block uppercase tracking-wider font-semibold">Total Comprado</span>
                      <strong className="text-xl sm:text-2xl font-black text-[#0d5638] block mt-0.5">
                        ${selectedCustomer.totalSpent.toFixed(2)}
                      </strong>
                    </div>
                  </div>

                  {/*  Historial de compras del cliente  */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-neutral-450 px-1">
                      Historial de Compras de {selectedCustomer.nombre}
                    </h3>

                    {selectedCustomer.orders.map((order, idx) => (
                      <div
                        key={order.id_pedido}
                        className="bg-white rounded-3xl border border-neutral-150 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300"
                      >
                        {/*  Encabezado de la orden  */}
                        <div className="bg-[#051a14]/5 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-xs text-[#062e20]">
                                Reserva #PED-{order.id_pedido}
                              </span>
                              <span className={`text-[10px] uppercase font-black px-2.5 py-0.5 rounded-md border ${getStatusBadgeClass(order.estado_pedido)}`}>
                                {order.estado_pedido}
                              </span>
                            </div>
                            <span className="text-[10px] text-neutral-450 font-light mt-0.5 block">
                              Realizada el {new Date(order.fecha_pedido).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] uppercase font-extrabold px-2 py-0.5 rounded border ${getPaymentBadgeClass(order.estado_pago || 'pendiente')}`}>
                              Pago: {order.estado_pago || 'pendiente'}
                            </span>
                            <span className="text-xs text-neutral-450 uppercase font-bold bg-white px-2 py-0.5 rounded border">
                              {order.metodo_pago.replace('_', ' ')}
                            </span>
                          </div>
                        </div>

                        {/*  Items de la orden  */}
                        <div className="px-6 py-4 divide-y divide-neutral-100">
                          {order.detalles?.map((det, detIdx) => (
                            <div key={detIdx} className="py-4 flex gap-4 first:pt-0 last:pb-0">
                              <div className="w-14 h-14 rounded-xl bg-neutral-50 overflow-hidden shrink-0 border border-neutral-100">
                                <img
                                  src={getServiceFallbackImage(det.servicio, detIdx)}
                                  alt={det.servicio?.nombre}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-grow min-w-0">
                                <h4 className="text-xs sm:text-sm font-bold text-[#062e20] leading-snug truncate">
                                  {det.servicio?.nombre}
                                </h4>
                                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-[10px] text-neutral-450 font-medium">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3 text-[#0d5638]" />
                                    Viaje: {det.fecha_viaje ? det.fecha_viaje : 'Pendiente'}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Users className="w-3 h-3 text-[#0d5638]" />
                                    Pasajeros: {det.num_personas}
                                  </span>
                                  <span>Cant: {det.cantidad}</span>
                                </div>
                              </div>
                              <div className="text-right shrink-0 self-center pl-2">
                                <span className="text-[10px] text-neutral-400 block">${parseFloat(det.precio_unitario).toFixed(2)} c/u</span>
                                <span className="text-xs font-black text-[#062e20]">${parseFloat(det.subtotal).toFixed(2)}</span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/*   Pie de la orden: Información de resumen  */}
                        {(order.factura || order.datos_pago) && (
                          <div className="px-6 py-3 bg-[#fafafa] border-t border-neutral-100 flex flex-wrap justify-between items-center text-[10px] text-neutral-450 gap-2">
                            {order.factura && (
                              <span>Factura: <strong className="text-neutral-700">{order.factura.numero_factura}</strong></span>
                            )}
                            {order.datos_pago && (
                              <span>Ref. Transacción: <strong className="text-neutral-700 font-mono">{order.datos_pago.referencia_externa}</strong></span>
                            )}
                            <span className="text-xs font-bold text-neutral-500">Monto Cobrado</span>
                          </div>
                        )}

                        {/*  Barra de total  */}
                        <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-100 flex justify-between items-center">
                          <span className="text-xs font-bold text-[#062e20]">Monto Total Reserva:</span>
                          <span className="text-base font-extrabold text-[#0d5638]">${parseFloat(order.total).toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /*  Estado vacío para el administrador (sin cliente seleccionado)  */
                <div className="bg-white rounded-3xl border border-neutral-100 p-12 text-center shadow-sm space-y-4">
                  <div className="w-16 h-16 bg-[#0d5638]/5 text-[#0d5638] rounded-2xl flex items-center justify-center mx-auto border border-[#0d5638]/10">
                    <User className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-[#062e20]">Visualizador de Compras por Cliente</h3>
                  <p className="text-sm text-neutral-400 font-light max-w-sm mx-auto leading-relaxed">
                    Selecciona un cliente de la barra lateral para examinar el historial consolidado de todas sus reservas de viaje, métodos de pago y estados financieros.
                  </p>
                </div>
              )}
            </div>

          </div>
        ) : (

          //Vista del cliente regular: historial de reservas  

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/*  columna izquierda: vista previa de estadísticas del cliente  */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-3xl border border-neutral-100 p-6 shadow-sm space-y-6">

                {/*  Perfil del cliente  */}
                <div className="text-center pb-4 border-b border-neutral-100 space-y-2">
                  <div className="w-16 h-16 rounded-full bg-[#0d5638]/10 text-[#0d5638] flex items-center justify-center text-xl font-bold border border-[#0d5638]/20 mx-auto">
                    {user?.nombre?.[0]?.toUpperCase()}{user?.apellidos?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-[#062e20]">{user?.nombre} {user?.apellidos}</h3>
                    <p className="text-[11px] text-neutral-400 font-light mt-0.5">{user?.email}</p>
                  </div>
                </div>

                {/*  Panel de estadísticas del cliente  */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-100 text-center">
                    <TrendingUp className="w-5 h-5 text-[#84cc16] mx-auto mb-1" />
                    <span className="text-[10px] text-neutral-450 uppercase font-bold block">Inversión</span>
                    <strong className="text-base font-black text-[#0d5638]">${clientTotalSpent.toFixed(2)}</strong>
                  </div>

                  <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-100 text-center">
                    <Briefcase className="w-5 h-5 text-[#0d5638] mx-auto mb-1" />
                    <span className="text-[10px] text-neutral-450 uppercase font-bold block">Viajes Activos</span>
                    <strong className="text-base font-black text-[#0d5638]">{clientActiveBookings}</strong>
                  </div>
                </div>

                {/*   asistencia al cliente  */}
                <div className="bg-[#fcfdfc] border border-neutral-100 p-4 rounded-2xl flex gap-3 text-xs text-neutral-600">
                  <HelpCircle className="w-5 h-5 text-[#0d5638] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#062e20] block">¿Necesitas soporte?</span>
                    <p className="font-light mt-0.5 text-neutral-500 leading-normal">
                      Si requieres cambiar las fechas de viaje o reprogramar una reserva confirmada, contáctanos a soporte@travelandroutes.com.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/*  columna derecha: lista de tarjetas de reserva del cliente */}
            <div className="lg:col-span-8 space-y-6">
              {clientLoading ? (
                <div className="h-[30vh] flex flex-col items-center justify-center gap-3 text-neutral-500 bg-white rounded-3xl border border-neutral-100 shadow-sm">
                  <div className="w-7 h-7 border-2 border-[#0d5638] border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs">Sincronizando tus itinerarios...</p>
                </div>
              ) : clientOrders.length === 0 ? (
                /*  Si el cliente no tiene reservas  */
                <div className="bg-white rounded-3xl border border-neutral-100 p-12 text-center shadow-sm space-y-5 py-16">
                  <div className="w-16 h-16 bg-neutral-50 text-neutral-300 rounded-full flex items-center justify-center mx-auto border border-neutral-100 mb-2">
                    <ShoppingBag className="w-7 h-7 stroke-[1.5]" />
                  </div>
                  <h3 className="text-lg font-bold text-[#062e20]">No tienes reservas realizadas</h3>
                  <p className="text-sm text-neutral-400 font-light max-w-sm mx-auto leading-relaxed">
                    Aún no has contratado ningún servicio en la plataforma. Explora nuestras opciones premium de traslados, hoteles y tours interactivos.
                  </p>
                  <Link
                    to="/services"
                    className="inline-flex bg-[#0d5638] hover:bg-[#062e20] text-white text-xs font-bold px-6 py-3.5 rounded-xl transition-all duration-300 shadow-xs gap-2 items-center mx-auto"
                  >
                    Ver Catálogo de Servicios
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                /*  lista de reservas del cliente  */
                <div className="space-y-6">
                  {clientOrders.map((order, idx) => (
                    <div
                      key={order.id_pedido}
                      className="bg-white rounded-3xl border border-neutral-150 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300"
                    >
                      {/*  encabezado de la tarjeta  */}
                      <div className="bg-[#051a14]/5 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-xs text-[#062e20]">
                              Reserva #PED-{order.id_pedido}
                            </span>
                            <span className={`text-[10px] uppercase font-black px-2.5 py-0.5 rounded-md border ${getStatusBadgeClass(order.estado_pedido)}`}>
                              {order.estado_pedido}
                            </span>
                          </div>
                          <span className="text-[10px] text-neutral-450 font-light mt-0.5 block">
                            Realizada el {new Date(order.fecha_pedido).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] uppercase font-extrabold px-2 py-0.5 rounded border ${getPaymentBadgeClass(order.estado_pago || 'pendiente')}`}>
                            Pago: {order.estado_pago || 'pendiente'}
                          </span>
                          <span className="text-xs text-neutral-450 uppercase font-bold bg-white px-2 py-0.5 rounded border">
                            {order.metodo_pago.replace('_', ' ')}
                          </span>
                        </div>
                      </div>

                      {/* items de la tarjeta  */}
                      <div className="px-6 py-4 divide-y divide-neutral-100">
                        {order.detalles?.map((det, detIdx) => (
                          <div key={detIdx} className="py-4 flex gap-4 first:pt-0 last:pb-0">
                            <div className="w-14 h-14 rounded-xl bg-neutral-50 overflow-hidden shrink-0 border border-neutral-100">
                              <img
                                src={getServiceFallbackImage(det.servicio, detIdx)}
                                alt={det.servicio?.nombre}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-grow min-w-0">
                              <h4 className="text-xs sm:text-sm font-bold text-[#062e20] leading-snug truncate">
                                {det.servicio?.nombre}
                              </h4>
                              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-[10px] text-neutral-450 font-medium">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3 text-[#0d5638]" />
                                  Viaje: {det.fecha_viaje ? det.fecha_viaje : 'Pendiente'}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Users className="w-3 h-3 text-[#0d5638]" />
                                  Pasajeros: {det.num_personas}
                                </span>
                                <span>Cant: {det.cantidad}</span>
                              </div>
                            </div>
                            <div className="text-right shrink-0 self-center pl-2">
                              <span className="text-[10px] text-neutral-400 block">${parseFloat(det.precio_unitario).toFixed(2)} c/u</span>
                              <span className="text-xs font-black text-[#062e20]">${parseFloat(det.subtotal).toFixed(2)}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/*  Pie de página con detalles de factura/transacción  */}
                      {(order.factura || order.datos_pago) && (
                        <div className="px-6 py-3 bg-[#fafafa] border-t border-neutral-100 flex flex-wrap justify-between items-center text-[10px] text-neutral-450 gap-2">
                          {order.factura && (
                            <span>Factura: <strong className="text-neutral-700">{order.factura.numero_factura}</strong></span>
                          )}
                          {order.datos_pago && (
                            <span>Ref. Transacción: <strong className="text-neutral-700 font-mono">{order.datos_pago.referencia_externa}</strong></span>
                          )}
                          <span className="text-xs font-bold text-neutral-500">Monto Reservado</span>
                        </div>
                      )}

                      {/*  barra total  */}
                      <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-100 flex justify-between items-center">
                        <span className="text-xs font-bold text-[#062e20]">Monto Reservado Total:</span>
                        <span className="text-base font-extrabold text-[#0d5638]">${parseFloat(order.total).toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
