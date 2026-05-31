import { useState } from 'react';
import { X, Trash2, Plus, Minus, CreditCard, ShoppingBag, Calendar, Users, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

export default function CartDrawer({ isOpen, onClose }) {
  const { cartItems, cartTotal, loading, updateCartItem, removeFromCart, clearCart, checkout } = useCart();
  const [metodoPago, setMetodoPago] = useState('transferencia');
  const [titular, setTitular] = useState('');
  const [numeroTarjeta, setNumeroTarjeta] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successOrder, setSuccessOrder] = useState(null);

  if (!isOpen) return null;

  const handleQuantityChange = async (item, delta) => {
    const newQty = item.cantidad + delta;
    if (newQty < 1) return;
    await updateCartItem(item.id_carrito, newQty);
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessOrder(null);

    // validacion de los campos de la tarjeta
    if (metodoPago === 'tarjeta_credito' || metodoPago === 'tarjeta_debito') {
      if (!titular.trim() || !numeroTarjeta.trim()) {
        setErrorMsg('Por favor completa los datos de la tarjeta.');
        setIsSubmitting(false);
        return;
      }
    }

    try {
      const res = await checkout(metodoPago, titular, numeroTarjeta);
      if (res.success) {
        setSuccessOrder(res.order);
        //limpiar campos de la tarjeta
        setTitular('');
        setNumeroTarjeta('');
      } else {
        setErrorMsg(res.message || 'El pago fue rechazado o hubo un error al crear la reserva.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Error de red. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFallbackImage = (service, idx) => {
    if (service?.imagen_url && service.imagen_url.trim() !== '') {
      return service.imagen_url;
    }
    return 'http://127.0.0.1:8000/storage/servicios/no%20hay%20imagen.webp';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans" style={{ fontFamily: "'Outfit', sans-serif" }}>
      {/* fondo oscuro traslucido  */}
      <div
        className="absolute inset-0 bg-black/70 transition-opacity duration-300"
        onClick={onClose}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col h-full transform transition-all duration-300">

          {/* cabecera del carrito  */}
          <div className="px-6 py-5 bg-[#062e20] text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#84cc16]" />
              <h2 className="text-lg font-bold">Tu Carrito de Viajes</h2>
              <span className="bg-[#84cc16] text-[#062e20] text-xs font-extrabold px-2.5 py-0.5 rounded-full">
                {cartItems.length}
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* cuerpo del carrito */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {successOrder ? (
              /* estado de confirmacion de reserva */
              <div className="text-center py-10 px-4 space-y-5 animate-fadeIn">
                <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
                  <CheckCircle className="w-10 h-10 stroke-[2.5]" />
                </div>
                <h3 className="text-xl font-extrabold text-[#062e20]">¡Reserva Confirmada!</h3>
                <p className="text-sm text-neutral-500 font-light leading-relaxed">
                  Tu reserva ha sido procesada exitosamente con el código
                  <strong className="text-[#0d5638] font-bold block mt-1 text-base">
                    #{successOrder.id_pedido} - Pago Aprobado
                  </strong>
                </p>
                <div className="bg-[#f7f9f7] rounded-2xl p-4 border border-neutral-100 text-left text-xs text-neutral-600 space-y-2">
                  <div className="flex justify-between">
                    <span className="font-semibold">Total pagado:</span>
                    <span className="font-extrabold text-[#0d5638]">${parseFloat(successOrder.total).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Método de pago:</span>
                    <span className="uppercase">{successOrder.metodo_pago.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Estado Reserva:</span>
                    <span className="text-emerald-600 font-bold capitalize">{successOrder.estado_pedido}</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSuccessOrder(null);
                    onClose();
                  }}
                  className="w-full py-3 bg-[#0d5638] hover:bg-[#062e20] text-white font-extrabold rounded-xl transition-all duration-300 shadow-sm"
                >
                  Seguir Explorando
                </button>
              </div>
            ) : cartItems.length === 0 ? (
              /* estado vacio  */
              <div className="h-full flex flex-col justify-center items-center text-center space-y-4 py-16">
                <div className="w-16 h-16 bg-neutral-50 text-neutral-300 rounded-full flex items-center justify-center mb-2 border border-neutral-100">
                  <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
                </div>
                <h3 className="text-lg font-bold text-[#062e20]">Tu carrito está vacío</h3>
                <p className="text-sm text-neutral-400 font-light max-w-xs leading-relaxed">
                  Añade traslados, hoteles o tours espectaculares a tu carrito de viaje para reservarlos al instante.
                </p>
                <Link
                  to="/services"
                  onClick={onClose}
                  className="inline-flex bg-[#0d5638] hover:bg-[#062e20] text-white text-xs font-bold px-6 py-3 rounded-xl transition-all duration-300 shadow-xs"
                >
                  Explorar Servicios
                </Link>
              </div>
            ) : (
              /* lista de carrito  */
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-neutral-100">
                  <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Productos</span>
                  <button
                    onClick={clearCart}
                    className="text-xs font-semibold text-red-500 hover:text-red-700 transition-colors flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Vaciar todo
                  </button>
                </div>

                <div className="divide-y divide-neutral-100 max-h-[320px] overflow-y-auto pr-1">
                  {cartItems.map((item, idx) => {
                    const price = parseFloat(item.servicio?.precio || 0);
                    const subtotal = price * item.cantidad;

                    return (
                      <div key={item.id_carrito} className="py-4 flex gap-4 group">
                        {/* imagen */}
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-neutral-100 flex-shrink-0 border border-neutral-100">
                          <img
                            src={getFallbackImage(item.servicio, idx)}
                            alt={item.servicio?.nombre || 'Servicio'}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* detalles de informacion  */}
                        <div className="flex-grow min-w-0 flex flex-col justify-between">
                          <div>
                            <h4 className="text-xs sm:text-sm font-bold text-[#062e20] leading-snug line-clamp-1 group-hover:text-[#0d5638] transition-colors">
                              {item.servicio?.nombre || 'Servicio de Viaje'}
                            </h4>
                            {/* etiquetas de detalles del viaje  */}
                            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-[10px] text-neutral-400">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-2.5 h-2.5 text-[#0d5638]" />
                                {item.fecha_viaje ? item.fecha_viaje : 'Pendiente'}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="w-2.5 h-2.5 text-[#0d5638]" />
                                {item.num_personas} {item.num_personas === 1 ? 'persona' : 'personas'}
                              </span>
                            </div>
                          </div>

                          {/* controles y precio */}
                          <div className="flex items-center justify-between mt-2">
                            {/* contador  */}
                            <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden bg-neutral-50">
                              <button
                                onClick={() => handleQuantityChange(item, -1)}
                                className="p-1 hover:bg-neutral-100 transition-colors text-neutral-500"
                                disabled={item.cantidad <= 1}
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="px-2 text-xs font-bold text-[#062e20] min-w-[20px] text-center">
                                {item.cantidad}
                              </span>
                              <button
                                onClick={() => handleQuantityChange(item, 1)}
                                className="p-1 hover:bg-neutral-100 transition-colors text-neutral-500"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            {/* precio  */}
                            <div className="text-right">
                              <span className="text-[10px] text-neutral-400 block">${price.toFixed(2)} c/u</span>
                              <span className="text-xs font-extrabold text-[#0d5638]">${subtotal.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>

                        {/* boton de eliminar  */}
                        <div className="flex-shrink-0 flex items-start">
                          <button
                            onClick={() => removeFromCart(item.id_carrito)}
                            className="text-neutral-300 hover:text-red-500 p-1 rounded-lg hover:bg-neutral-50 transition-all cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* total y checkout  */}
          {cartItems.length > 0 && !successOrder && (
            <div className="bg-[#f7f9f7] border-t border-neutral-100 p-6 space-y-4">

              {/* total del carrito  */}
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-[#062e20]">Monto Total:</span>
                <span className="text-lg font-black text-[#0d5638]">${parseFloat(cartTotal).toFixed(2)}</span>
              </div>

              {/* metodos de pago */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                  Método de Reserva y Pago
                </span>

                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'transferencia', label: 'Transferencia' },
                    { id: 'paypal', label: 'PayPal' },
                    { id: 'tarjeta_credito', label: 'Tarjeta' }
                  ].map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setMetodoPago(method.id)}
                      className={`py-2 px-1 text-center rounded-lg border text-xs font-semibold capitalize transition-all cursor-pointer ${metodoPago === method.id
                          ? 'border-[#0d5638] bg-[#0d5638]/5 text-[#0d5638] shadow-xs'
                          : 'border-neutral-200 bg-white text-neutral-500 hover:border-neutral-300'
                        }`}
                    >
                      {method.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* detalles del pago */}
              {(metodoPago === 'tarjeta_credito' || metodoPago === 'tarjeta_debito') && (
                <div className="bg-white border border-neutral-100 rounded-xl p-3.5 space-y-3 shadow-xs animate-fadeIn">
                  <div className="flex items-center gap-1.5 text-xs text-[#062e20] font-bold border-b border-neutral-50 pb-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-[#0d5638]" />
                    <span>Detalles del Pago Seguro (Simulado)</span>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">
                      Nombre del Titular
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. Juan Pérez"
                      value={titular}
                      onChange={(e) => setTitular(e.target.value)}
                      className="w-full border border-neutral-200 px-3 py-1.5 rounded-lg text-xs outline-none focus:border-[#0d5638]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">
                      Número de Tarjeta
                    </label>
                    <input
                      type="text"
                      placeholder="4000 1234 5678 9010"
                      value={numeroTarjeta}
                      onChange={(e) => setNumeroTarjeta(e.target.value)}
                      className="w-full border border-neutral-200 px-3 py-1.5 rounded-lg text-xs outline-none focus:border-[#0d5638]"
                    />
                  </div>
                </div>
              )}

              {/* mensajes de error  */}
              {errorMsg && (
                <div className="bg-red-50 border border-red-100 text-red-700 text-xs p-3 rounded-xl flex items-start gap-2 animate-shake">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* boton de accion para pagar  */}
              <button
                onClick={handleCheckout}
                disabled={isSubmitting}
                className="w-full py-3.5 bg-[#84cc16] hover:bg-[#72b012] disabled:bg-neutral-300 text-white font-extrabold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:shadow-none cursor-pointer text-sm"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Procesando Reserva...
                  </>
                ) : (
                  <>
                    Reservar y Pagar
                  </>
                )}
              </button>

              <p className="text-[10px] text-neutral-400 text-center font-light leading-relaxed">
                Reserva respaldada por Travel & Routes. Cancelación flexible de acuerdo a las políticas de cada servicio.
              </p>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
