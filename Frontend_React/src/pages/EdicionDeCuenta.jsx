import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { User, Shield, Phone, Mail, Lock, CheckCircle, AlertCircle, Save, Key } from 'lucide-react';
import api from '../api/axios';

export default function EdicionDeCuenta() {
  const { user, setUser, token } = useAuth();
  const navigate = useNavigate();

  // active tab state
  const [activeTab, setActiveTab] = useState('perfil');

  // profile form states
  const [profileForm, setProfileForm] = useState({
    nombre: '',
    apellidos: '',
    email: '',
    telefono: ''
  });

  // password form states
  const [passwordForm, setPasswordForm] = useState({
    password_actual: '',
    password_nuevo: '',
    password_nuevo_confirmation: ''
  });

  // alert/status states
  const [profileStatus, setProfileStatus] = useState({ success: null, message: '' });
  const [passwordStatus, setPasswordStatus] = useState({ success: null, message: '' });
  const [loading, setLoading] = useState(false);

  // populate profile form when user info is loaded
  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }
    if (user) {
      setProfileForm({
        nombre: user.nombre || '',
        apellidos: user.apellidos || '',
        email: user.email || '',
        telefono: user.telefono || ''
      });
    }
  }, [user, token, navigate]);

  // handle profile update submission
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setProfileStatus({ success: null, message: '' });

    try {
      const response = await api.put('/user/profile', profileForm);
      setUser(response.data.user); // update global authcontext user details
      setProfileStatus({
        success: true,
        message: '¡Tus datos personales se han actualizado correctamente!'
      });
    } catch (err) {
      console.error('Error al actualizar perfil:', err);
      const msg = err.response?.data?.message || 'Ocurrió un error al actualizar tus datos.';
      setProfileStatus({
        success: false,
        message: msg
      });
    } finally {
      setLoading(false);
    }
  };

  // handle password update submission
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPasswordStatus({ success: null, message: '' });

    if (passwordForm.password_nuevo !== passwordForm.password_nuevo_confirmation) {
      setPasswordStatus({
        success: false,
        message: 'Las contraseñas nuevas no coinciden.'
      });
      setLoading(false);
      return;
    }

    try {
      await api.put('/user/password', {
        password_actual: passwordForm.password_actual,
        password_nuevo: passwordForm.password_nuevo,
        password_nuevo_confirmation: passwordForm.password_nuevo_confirmation
      });
      setPasswordStatus({
        success: true,
        message: '¡Tu contraseña ha sido cambiada exitosamente!'
      });
      // clear password fields
      setPasswordForm({
        password_actual: '',
        password_nuevo: '',
        password_nuevo_confirmation: ''
      });
    } catch (err) {
      console.error('Error al cambiar contraseña:', err);
      const msg = err.response?.data?.message || err.response?.data?.errors?.password_actual?.[0] || 'Ocurrió un error al cambiar la contraseña.';
      setPasswordStatus({
        success: false,
        message: msg
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col" style={{ fontFamily: "'Outfit', sans-serif" }}>
      <Header />

      {/* hero banner area  */}
      <div className="relative h-[35vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=1200"
            alt="Configuración"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#062e20]/50" />
        </div>
        <div className="relative z-10 text-center text-white px-4 mt-16 animate-in fade-in zoom-in-95 duration-500">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-wide uppercase">Editar Cuenta</h1>
          <p className="text-neutral-200 text-xs sm:text-sm mt-1 max-w-xl mx-auto font-light">
            Gestiona tus datos personales y actualiza tu configuración de seguridad.
          </p>
        </div>
      </div>

      {/* main settings panel  */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-6 sm:px-12 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* left sidebar navigation  */}
          <div className="lg:col-span-1 space-y-6">
            {/* quick profile summary card  */}
            <div className="bg-white rounded-3xl p-6 border border-neutral-100 shadow-sm text-center">
              <div className="w-16 h-16 rounded-full bg-[#0d5638]/10 text-[#0d5638] flex items-center justify-center mx-auto mb-4 border border-[#0d5638]/20 shadow-xs">
                <User className="w-8 h-8" />
              </div>
              <h3 className="font-extrabold text-[#062e20] text-base truncate">
                {user.nombre} {user.apellidos}
              </h3>
              <p className="text-neutral-400 text-xs truncate mt-0.5">{user.email}</p>
              <div className="mt-3 inline-block bg-[#0d5638]/10 text-[#0d5638] text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full tracking-wider">
                {user.tipo_usuario}
              </div>
            </div>

            {/* sidebar navigation options  */}
            <div className="bg-white rounded-3xl p-3 border border-neutral-100 shadow-sm flex flex-row lg:flex-col gap-1.5 overflow-x-auto lg:overflow-visible">
              
              {/* profile details tab  */}
              <button
                onClick={() => setActiveTab('perfil')}
                className={`w-full flex items-center justify-center lg:justify-start gap-3 px-4 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all duration-300 cursor-pointer ${
                  activeTab === 'perfil'
                    ? 'bg-[#0d5638] text-white shadow-xs'
                    : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700'
                }`}
              >
                <User className="w-4 h-4" />
                <span className="whitespace-nowrap">Datos Personales</span>
              </button>

              {/* security tab  */}
              <button
                onClick={() => setActiveTab('seguridad')}
                className={`w-full flex items-center justify-center lg:justify-start gap-3 px-4 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all duration-300 cursor-pointer ${
                  activeTab === 'seguridad'
                    ? 'bg-[#0d5638] text-white shadow-xs'
                    : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700'
                }`}
              >
                <Shield className="w-4 h-4" />
                <span className="whitespace-nowrap">Seguridad</span>
              </button>

            </div>
          </div>

          {/* right main form area  */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm p-6 sm:p-8 min-h-[400px] flex flex-col">
              
              {/* tab 1: datos personales  */}
              {activeTab === 'perfil' && (
                <div className="space-y-6 flex-grow flex flex-col justify-between">
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-extrabold text-[#062e20]">Información Personal</h2>
                      <p className="text-neutral-400 text-xs sm:text-sm font-light mt-1">
                        Mantén tus datos actualizados para recibir correos y notificaciones de tus reservas.
                      </p>
                    </div>

                    {/* alert banner  */}
                    {profileStatus.message && (
                      <div className={`p-4 rounded-xl flex items-start gap-3 border text-xs sm:text-sm ${
                        profileStatus.success 
                          ? 'bg-green-50 text-green-700 border-green-100' 
                          : 'bg-red-50 text-red-700 border-red-100'
                      }`}>
                        {profileStatus.success ? (
                          <CheckCircle className="w-5 h-5 flex-shrink-0" />
                        ) : (
                          <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        )}
                        <span className="font-medium">{profileStatus.message}</span>
                      </div>
                    )}

                    <form onSubmit={handleProfileSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {/* nombre  */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Nombre</label>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            value={profileForm.nombre}
                            onChange={(e) => setProfileForm(prev => ({ ...prev, nombre: e.target.value }))}
                            className="w-full bg-neutral-50 border border-neutral-200/80 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 focus:bg-white focus:border-[#0d5638] focus:ring-1 focus:ring-[#0d5638] outline-none transition-all duration-300"
                            placeholder="Tu nombre"
                          />
                        </div>
                      </div>

                      {/* apellidos  */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Apellidos</label>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            value={profileForm.apellidos}
                            onChange={(e) => setProfileForm(prev => ({ ...prev, apellidos: e.target.value }))}
                            className="w-full bg-neutral-50 border border-neutral-200/80 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 focus:bg-white focus:border-[#0d5638] focus:ring-1 focus:ring-[#0d5638] outline-none transition-all duration-300"
                            placeholder="Tus apellidos"
                          />
                        </div>
                      </div>

                      {/* email  */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Correo Electrónico</label>
                        <div className="relative flex items-center">
                          <Mail className="w-4 h-4 text-neutral-400 absolute left-4 pointer-events-none" />
                          <input
                            type="email"
                            required
                            value={profileForm.email}
                            onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                            className="w-full bg-neutral-50 border border-neutral-200/80 rounded-xl pl-11 pr-4 py-3 text-sm font-semibold text-slate-800 focus:bg-white focus:border-[#0d5638] focus:ring-1 focus:ring-[#0d5638] outline-none transition-all duration-300"
                            placeholder="correo@ejemplo.com"
                          />
                        </div>
                      </div>

                      {/* Teléfono */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Teléfono de Contacto</label>
                        <div className="relative flex items-center">
                          <Phone className="w-4 h-4 text-neutral-400 absolute left-4 pointer-events-none" />
                          <input
                            type="text"
                            value={profileForm.telefono}
                            onChange={(e) => setProfileForm(prev => ({ ...prev, telefono: e.target.value }))}
                            className="w-full bg-neutral-50 border border-neutral-200/80 rounded-xl pl-11 pr-4 py-3 text-sm font-semibold text-slate-800 focus:bg-white focus:border-[#0d5638] focus:ring-1 focus:ring-[#0d5638] outline-none transition-all duration-300"
                            placeholder="Nº celular o teléfono"
                          />
                        </div>
                      </div>
                    </form>
                  </div>

                  <div className="pt-6 border-t border-neutral-50 mt-6 flex justify-end">
                    <button
                      onClick={handleProfileSubmit}
                      disabled={loading}
                      className="bg-[#0d5638] hover:bg-[#0a452c] disabled:bg-neutral-300 text-white font-extrabold text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
                    >
                      <Save className="w-4 h-4" />
                      {loading ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                  </div>
                </div>
              )}

              {/* tab 2: seguridad (password)  */}
              {activeTab === 'seguridad' && (
                <div className="space-y-6 flex-grow flex flex-col justify-between">
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-extrabold text-[#062e20]">Configuración de Seguridad</h2>
                      <p className="text-neutral-400 text-xs sm:text-sm font-light mt-1">
                        Cambia tu contraseña periódicamente para proteger los detalles de tu cuenta de viajero.
                      </p>
                    </div>

                    {/* alert banner  */}
                    {passwordStatus.message && (
                      <div className={`p-4 rounded-xl flex items-start gap-3 border text-xs sm:text-sm ${
                        passwordStatus.success 
                          ? 'bg-green-50 text-green-700 border-green-100' 
                          : 'bg-red-50 text-red-700 border-red-100'
                      }`}>
                        {passwordStatus.success ? (
                          <CheckCircle className="w-5 h-5 flex-shrink-0" />
                        ) : (
                          <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        )}
                        <span className="font-medium">{passwordStatus.message}</span>
                      </div>
                    )}

                    <form onSubmit={handlePasswordSubmit} className="space-y-5 max-w-xl">
                      {/* password actual  */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Contraseña Actual</label>
                        <div className="relative flex items-center">
                          <Lock className="w-4 h-4 text-neutral-400 absolute left-4 pointer-events-none" />
                          <input
                            type="password"
                            required
                            value={passwordForm.password_actual}
                            onChange={(e) => setPasswordForm(prev => ({ ...prev, password_actual: e.target.value }))}
                            className="w-full bg-neutral-50 border border-neutral-200/80 rounded-xl pl-11 pr-4 py-3 text-sm font-semibold text-slate-800 focus:bg-white focus:border-[#0d5638] focus:ring-1 focus:ring-[#0d5638] outline-none transition-all duration-300"
                            placeholder="Tu contraseña actual"
                          />
                        </div>
                      </div>

                      {/* Nueva Contraseña */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Nueva Contraseña</label>
                        <div className="relative flex items-center">
                          <Lock className="w-4 h-4 text-neutral-400 absolute left-4 pointer-events-none" />
                          <input
                            type="password"
                            required
                            value={passwordForm.password_nuevo}
                            onChange={(e) => setPasswordForm(prev => ({ ...prev, password_nuevo: e.target.value }))}
                            className="w-full bg-neutral-50 border border-neutral-200/80 rounded-xl pl-11 pr-4 py-3 text-sm font-semibold text-slate-800 focus:bg-white focus:border-[#0d5638] focus:ring-1 focus:ring-[#0d5638] outline-none transition-all duration-300"
                            placeholder="Mínimo 6 caracteres"
                          />
                        </div>
                      </div>

                      {/* Confirmar Nueva Contraseña */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Confirmar Nueva Contraseña</label>
                        <div className="relative flex items-center">
                          <Lock className="w-4 h-4 text-neutral-400 absolute left-4 pointer-events-none" />
                          <input
                            type="password"
                            required
                            value={passwordForm.password_nuevo_confirmation}
                            onChange={(e) => setPasswordForm(prev => ({ ...prev, password_nuevo_confirmation: e.target.value }))}
                            className="w-full bg-neutral-50 border border-neutral-200/80 rounded-xl pl-11 pr-4 py-3 text-sm font-semibold text-slate-800 focus:bg-white focus:border-[#0d5638] focus:ring-1 focus:ring-[#0d5638] outline-none transition-all duration-300"
                            placeholder="Repite la contraseña nueva"
                          />
                        </div>
                      </div>
                    </form>
                  </div>

                  <div className="pt-6 border-t border-neutral-50 mt-6 flex justify-end">
                    <button
                      onClick={handlePasswordSubmit}
                      disabled={loading}
                      className="bg-[#0d5638] hover:bg-[#0a452c] disabled:bg-neutral-300 text-white font-extrabold text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
                    >
                      <Key className="w-4 h-4" />
                      {loading ? 'Actualizando...' : 'Cambiar Contraseña'}
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
