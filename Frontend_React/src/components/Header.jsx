import { Menu, LogIn, LogOut, LayoutDashboard, User, ChevronDown, Calendar, ShoppingBag } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import AuthModal from './AuthModal';
import CartDrawer from './CartDrawer';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, token, logout, isAdmin } = useAuth();
  const { cartItems } = useCart();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // escuchador de scroll para alternar fondos
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // cerrar menu desplegable al hacer clic fuera
  useEffect(() => {
    const closeDropdown = (e) => {
      if (dropdownOpen && !e.target.closest('.user-profile-dropdown')) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('click', closeDropdown);
    return () => document.removeEventListener('click', closeDropdown);
  }, [dropdownOpen]);

  // clases de estilos adaptativos
  const isHeaderActive = isScrolled || mobileMenuOpen;

  const headerBgClass = isHeaderActive
    ? 'bg-white shadow-md py-3 md:py-4'
    : 'bg-transparent py-5 md:py-7';

  const logoColorClass = isHeaderActive
    ? 'text-[#e03a14]'
    : 'text-white';

  const navLinkColorClass = isHeaderActive
    ? 'text-slate-800 hover:text-[#e03a14]'
    : 'text-white hover:text-[#84cc16]';

  const menuToggleColorClass = isHeaderActive
    ? 'text-slate-800'
    : 'text-white';

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${headerBgClass}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo / Título de la empresa */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center py-2">
              <img
                src={isHeaderActive ? "/images/logo_travel_and_routes.png" : "/images/logo_travel_and_routes_2.PNG"}
                alt="Travel & Routes Logo"
                className="h-14 sm:h-15 w-auto object-contain transition-transform duration-300 hover:scale-105"
              />
            </Link>
          </div>

          {/* Enlaces de navegación de escritorio */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className={`font-semibold text-xl transition-colors duration-300 ${navLinkColorClass}`}>Inicio</Link>
            <Link to="/services" className={`font-semibold text-xl transition-colors duration-300 ${navLinkColorClass}`}>Servicios</Link>
            <Link to="/tours" className={`font-semibold text-xl transition-colors duration-300 ${navLinkColorClass}`}>Tours</Link>
            <Link to="/about" className={`font-semibold text-xl transition-colors duration-300 ${navLinkColorClass}`}>Sobre Nosotros</Link>
          </nav>

          {/* Panel de usuario / Autenticación en escritorio */}
          <div className="hidden md:flex items-center space-x-4">
            {token && user ? (
              <div className="relative user-profile-dropdown">
                {/* Botón activador */}
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 font-semibold text-sm shadow-xs cursor-pointer ${isHeaderActive
                    ? 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                    : 'bg-white/10 text-white border-white/20 hover:bg-white/20 hover:border-white/30 backdrop-blur-md'
                    }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white ${isHeaderActive ? 'bg-[#0d5638]' : 'bg-[#84cc16]'
                    }`}>
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <span>{user.nombre}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Menú desplegable */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white border border-neutral-100 rounded-2xl shadow-xl z-50 py-3 text-slate-800 animate-in fade-in slide-in-from-top-2 duration-200">

                    {/* Encabezado con información del usuario */}
                    <div className="px-4 py-2 border-b border-neutral-50 mb-2">
                      <div className="font-extrabold text-sm text-slate-800 truncate">{user.nombre} {user.apellidos}</div>
                      <div className="text-xs text-neutral-400 truncate">{user.email}</div>
                    </div>

                    {/* Panel de Administración */}
                    {isAdmin() && (
                      <Link
                        to="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-neutral-50 hover:text-[#0d5638] transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-neutral-400 group-hover:text-[#0d5638]" />
                        Panel de Administración
                      </Link>
                    )}

                    {/* enlace a mi perfil  */}
                    <Link
                      to="/edit-profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-neutral-50 hover:text-[#0d5638] transition-colors"
                    >
                      <User className="w-4 h-4 text-neutral-400" />
                      Mi Perfil
                    </Link>

                    {/* enlace a mis reservas  */}
                    <Link
                      to="/mis-reservas"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-neutral-50 hover:text-[#0d5638] transition-colors"
                    >
                      <Calendar className="w-4 h-4 text-neutral-400" />
                      Mis Reservas
                    </Link>

                    {/* separador  */}
                    <div className="border-t border-neutral-50 my-2" />

                    {/* Cerrar Sesión */}
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs sm:text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors text-left cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-rose-400" />
                      Cerrar Sesión
                    </button>

                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className={`px-5 py-2.5 rounded-none font-bold text-xs uppercase tracking-wider inline-flex items-center shadow-sm cursor-pointer transition-all duration-300 ${isHeaderActive
                  ? 'bg-[#f58a11] hover:bg-[#84cc16] text-white'
                  : 'bg-white hover:bg-neutral-100 text-slate-950'
                  }`}
              >
                <LogIn className="w-4 h-4 mr-2" />
                Iniciar Sesión
              </button>
            )}

            {/* Botón con icono de carrito para escritorio */}
            <button
              onClick={() => setIsCartOpen(true)}
              className={`relative p-2.5 rounded-full transition-all duration-300 cursor-pointer ${isHeaderActive
                ? 'text-[#062e20] hover:bg-slate-100'
                : 'text-white hover:bg-white/10'
                }`}
            >
              <ShoppingBag className="w-5.5 h-5.5 stroke-[2]" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#84cc16] text-[#062e20] text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                  {cartItems.length}
                </span>
              )}
            </button>
          </div>

          {/* Panel móvil de carrito y menú alternable */}
          <div className="flex items-center space-x-2 md:hidden">
            {/* Botón de carrito para móviles */}
            <button
              onClick={() => setIsCartOpen(true)}
              className={`relative p-2 rounded-full transition-colors cursor-pointer ${menuToggleColorClass}`}
            >
              <ShoppingBag className="w-5.5 h-5.5" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#84cc16] text-[#062e20] text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-white">
                  {cartItems.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 transition-colors duration-300 hover:scale-105 active:scale-95 ${menuToggleColorClass}`}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Menú desplegable móvil */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-100 mt-3 animate-in fade-in slide-in-from-top-4 duration-200">
            <nav className="flex flex-col space-y-4">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-800 hover:text-[#e03a14] font-semibold text-sm transition-colors py-1"
              >
                Inicio
              </Link>
              <Link
                to="/services"
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-800 hover:text-[#e03a14] font-semibold text-sm transition-colors py-1"
              >
                Servicios
              </Link>
              <Link
                to="/tours"
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-800 hover:text-[#e03a14] font-semibold text-sm transition-colors py-1"
              >
                Tours
              </Link>
              <Link
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-800 hover:text-[#e03a14] font-semibold text-sm transition-colors py-1"
              >
                Sobre Nosotros
              </Link>

              {/* Panel de usuario / Autenticación en móviles */}
              {token && user ? (
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <div className="px-1 text-sm font-medium text-slate-700">
                    Hola, <span className="text-[#e03a14] font-semibold">{user.nombre}</span>
                  </div>
                  <Link
                    to="/edit-profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center text-slate-800 hover:text-[#e03a14] font-semibold text-sm py-1.5"
                  >
                    <User className="w-4 h-4 mr-2 text-slate-500" />
                    Mi Perfil / Editar Cuenta
                  </Link>
                  <Link
                    to="/mis-reservas"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center text-slate-800 hover:text-[#e03a14] font-semibold text-sm py-1.5"
                  >
                    <Calendar className="w-4 h-4 mr-2 text-slate-500" />
                    Mis Reservas
                  </Link>
                  {isAdmin() && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center text-slate-800 hover:text-[#e03a14] font-semibold text-sm py-1.5"
                    >
                      <LayoutDashboard className="w-4 h-4 mr-2 text-slate-500" />
                      Panel Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center text-rose-600 hover:text-rose-700 font-semibold text-sm text-left py-1.5"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Cerrar Sesión
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setIsAuthModalOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center text-slate-800 hover:text-[#e03a14] font-semibold py-2 text-sm text-left w-full cursor-pointer"
                >
                  <LogIn className="w-4 h-4 mr-2 text-[#e03a14]" />
                  Iniciar Sesión
                </button>
              )}
            </nav>
          </div>
        )}
      </div>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  );
}
