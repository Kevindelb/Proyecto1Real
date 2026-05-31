import { useState } from 'react';
import { X, Eye, EyeOff, Loader2, Compass } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ isOpen, onClose }) {
  const { login, register } = useAuth();
  
  // estados
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // campos del formulario
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [telefono, setTelefono] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        onClose();
      } else {
        setError(result.message || 'Error en las credenciales');
      }
    } catch (err) {
      setError('Ocurrió un error inesperado al iniciar sesión.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!acceptedTerms) {
      setError('Debe aceptar los términos y condiciones para poder registrarse.');
      return;
    }

    setLoading(true);
    try {
      const result = await register(nombre, apellidos, email, password, telefono);
      if (result.success) {
        onClose();
      } else {
        setError(result.message || 'Error al registrar la cuenta');
      }
    } catch (err) {
      setError('Ocurrió un error inesperado al registrarse.');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    setError('');
    setAcceptedTerms(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 overflow-y-auto">
      <div 
        className="relative bg-[#111111] text-white w-full max-w-4xl rounded-none shadow-2xl border border-neutral-800 flex flex-col md:flex-row overflow-hidden min-h-[580px] animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón para cerrar */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors cursor-pointer z-20 p-1"
        >
          <X className="w-7 h-7 font-light" />
        </button>

        {/* LADO IZQUIERDO: Formularios (Iniciar Sesión / Registrarse) */}
        <div className="w-full md:w-[55%] p-8 md:p-12 flex flex-col justify-center">
          {/* logo corporativo oficial  */}
          <div className="flex items-center mb-6">
            <img 
              src="/images/logo_travel_and_routes_2.PNG" 
              alt="Travel & Routes Logo" 
              className="h-14 w-auto object-contain"
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-950/50 border border-red-800 text-red-400 text-xs rounded-none">
              {error}
            </div>
          )}

          {!isRegistering ? (
            /* FORMULARIO DE INICIO DE SESIÓN */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <h2 className="text-[#f58a11] text-3xl font-light tracking-wide mb-1">Inicie sesión.</h2>
                <p className="text-xs text-neutral-400 mb-6">Accede a tus beneficios de socio</p>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                  Dirección electrónica o número de socio
                </label>
                <input 
                  type="email" 
                  required
                  placeholder="ej.: juansanchez@website.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#1e1e1e] border border-neutral-800 focus:border-[#f58a11] px-4 py-2.5 text-white text-sm placeholder:text-neutral-600 focus:outline-none rounded-none transition-colors"
                  disabled={loading}
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                  Contraseña
                </label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    required
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#1e1e1e] border border-neutral-800 focus:border-[#f58a11] px-4 py-2.5 text-white text-sm placeholder:text-neutral-600 focus:outline-none rounded-none transition-colors pr-10"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center pt-2">
                <label className="flex items-center text-xs text-neutral-300 cursor-pointer select-none">
                  <input 
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="mr-2.5 accent-[#f58a11] w-4 h-4 bg-[#1e1e1e] border-neutral-800 text-[#f58a11] rounded-none focus:ring-0 focus:ring-offset-0 cursor-pointer"
                  />
                  Recordar mi información
                </label>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-[#0d5638] text-white hover:bg-[#f58a11] hover:text-white py-3.5 font-bold text-xs uppercase tracking-widest rounded-none transition-colors mt-4 flex items-center justify-center cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Iniciando Sesión...
                  </>
                ) : (
                  'Inicie sesión'
                )}
              </button>

              <div className="pt-2">
                <a 
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="text-xs text-[#f58a11] hover:text-white font-semibold transition-colors block"
                >
                  ¿Necesita ayuda con la contraseña? <span className="font-semibold">Restablecer contraseña</span>
                </a>
              </div>
            </form>
          ) : (
            /* FORMULARIO DE REGISTRO */
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <h2 className="text-[#f58a11] text-3xl font-light tracking-wide mb-1">Únase hoy.</h2>
                <p className="text-xs text-neutral-400 mb-6">Regístrate y comienza a disfrutar de tarifas exclusivas</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                    Nombre
                  </label>
                  <input 
                    type="text" 
                    required
                    placeholder="ej.: Juan" 
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full bg-[#1e1e1e] border border-neutral-800 focus:border-[#f58a11] px-4 py-2.5 text-white text-sm placeholder:text-neutral-600 focus:outline-none rounded-none transition-colors"
                    disabled={loading}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                    Apellidos
                  </label>
                  <input 
                    type="text" 
                    required
                    placeholder="ej.: Sánchez" 
                    value={apellidos}
                    onChange={(e) => setApellidos(e.target.value)}
                    className="w-full bg-[#1e1e1e] border border-neutral-800 focus:border-[#f58a11] px-4 py-2.5 text-white text-sm placeholder:text-neutral-600 focus:outline-none rounded-none transition-colors"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                  Correo Electrónico
                </label>
                <input 
                  type="email" 
                  required
                  placeholder="ej.: juansanchez@website.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#1e1e1e] border border-neutral-800 focus:border-[#f58a11] px-4 py-2.5 text-white text-sm placeholder:text-neutral-600 focus:outline-none rounded-none transition-colors"
                  disabled={loading}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                    Contraseña
                  </label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      required
                      placeholder="Mín. 6 caracteres"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-[#1e1e1e] border border-neutral-800 focus:border-[#f58a11] px-4 py-2.5 text-white text-sm placeholder:text-neutral-600 focus:outline-none rounded-none transition-colors pr-10"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                    Teléfono
                  </label>
                  <input 
                    type="tel" 
                    required
                    placeholder="ej.: +51 987654321" 
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    className="w-full bg-[#1e1e1e] border border-neutral-800 focus:border-[#f58a11] px-4 py-2.5 text-white text-sm placeholder:text-neutral-600 focus:outline-none rounded-none transition-colors"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="flex items-start pt-2">
                <label className="flex items-start text-xs text-neutral-300 cursor-pointer select-none leading-relaxed">
                  <input 
                    type="checkbox"
                    required
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="mr-2.5 mt-0.5 accent-[#f58a11] w-4 h-4 bg-[#1e1e1e] border-neutral-800 text-[#f58a11] rounded-none focus:ring-0 focus:ring-offset-0 cursor-pointer shrink-0"
                  />
                  <span>
                    Acepto los <a href="#" onClick={(e) => e.preventDefault()} className="text-[#f58a11] hover:underline font-semibold transition-colors">Términos y condiciones</a> de Travel & Routes y la <a href="#" onClick={(e) => e.preventDefault()} className="text-[#f58a11] hover:underline font-semibold transition-colors">Política de privacidad</a>.
                  </span>
                </label>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-[#0d5638] text-white hover:bg-[#f58a11] hover:text-white py-3.5 font-bold text-xs uppercase tracking-widest rounded-none transition-colors mt-4 flex items-center justify-center cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Registrando cuenta...
                  </>
                ) : (
                  'Registrarse ahora'
                )}
              </button>
            </form>
          )}
        </div>

        {/* separador  */}
        <div className="hidden md:block w-px bg-neutral-800 self-stretch my-12" />

        {/* LADO DERECHO: Información / Botones de alternancia */}
        <div className="w-full md:w-[45%] p-8 md:p-12 flex flex-col justify-center bg-[#111111]/40">
          {!isRegistering ? (
            /* TARJETA DE REGISTRO */
            <div className="space-y-6">
              <h3 className="text-lg font-normal text-[#f58a11] tracking-wide">
                ¿Aún no es socio de Travel & Routes One Rewards?
              </h3>
              <p className="text-neutral-400 text-xs leading-relaxed">
                Viva los viajes como deben ser: como una experiencia personal y gratificante. 
                Disfrute de tarifas exclusivas para socios, promociones personalizadas y Wi-Fi de alta velocidad incluido en todas sus rutas turísticas por el Perú. 
                Además, podrá ganar puntos por cada reserva realizada y canjearlos por noches de regalo, tours exclusivos, tarjetas de regalo y mucho más.
              </p>
              <a 
                href="#"
                onClick={(e) => e.preventDefault()} 
                className="text-[#f58a11] hover:text-white font-semibold text-xs tracking-wider uppercase block transition-colors"
              >
                Más información acerca de Travel & Routes One Rewards
              </a>
              <div className="pt-4">
                <button 
                  onClick={toggleMode}
                  className="w-full border border-[#f58a11] text-[#f58a11] hover:bg-[#f58a11] hover:text-white py-3.5 rounded-none font-bold text-xs uppercase tracking-widest transition-all cursor-pointer"
                >
                  Regístrese ahora
                </button>
              </div>
            </div>
          ) : (
            /* TARJETA DE INICIO DE SESIÓN */
            <div className="space-y-6">
              <h3 className="text-lg font-normal text-[#f58a11] tracking-wide">
                ¿Ya tiene una cuenta de socio?
              </h3>
              <p className="text-neutral-400 text-xs leading-relaxed">
                Inicie sesión para acceder a su portal personal. 
                Desde allí podrá consultar sus puntos acumulados, gestionar o modificar reservas activas de tours, revisar el historial de sus viajes por Cusco, Lima o Arequipa, y continuar disfrutando de todos los privilegios exclusivos que ofrece nuestra red a sus miembros más fieles.
              </p>
              <a 
                href="#"
                onClick={(e) => e.preventDefault()} 
                className="text-[#f58a11] hover:text-white font-semibold text-xs tracking-wider uppercase block transition-colors"
              >
                Términos y condiciones de membresía
              </a>
              <div className="pt-4">
                <button 
                  onClick={toggleMode}
                  className="w-full border border-[#f58a11] text-[#f58a11] hover:bg-[#f58a11] hover:text-white py-3.5 rounded-none font-bold text-xs uppercase tracking-widest transition-all cursor-pointer"
                >
                  Inicie sesión
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
