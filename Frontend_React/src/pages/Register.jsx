import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { Compass, Loader2 } from 'lucide-react';

function Register() {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [nombre, setNombre] = useState('');
    const [apellidos, setApellidos] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [telefono, setTelefono] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        const result = await register(nombre, apellidos, email, password, telefono);

        if (result.success) {
            // por defecto, laravel registra como 'cliente'. Redirigimos al catálogo
            navigate('/');
        } else {
            setError(result.message);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-radial from-slate-900 via-slate-950 to-black px-4 relative overflow-hidden py-12">
            {/* Fondo de decoración chido */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px]" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-500/5 blur-[120px]" />

            <div className="w-full max-w-md z-10 animate-in fade-in slide-in-from-bottom-8 duration-500">
                <div className="flex flex-col items-center justify-center mb-6">
                    <div className="bg-primary/20 p-3 rounded-2xl border border-primary/30 mb-3 shadow-inner">
                        <Compass className="w-8 h-8 text-primary animate-pulse" />
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight text-white">Travel & Routes</h2>
                    <p className="text-sm text-slate-400">Crear una cuenta de explorador</p>
                </div>

                <Card className="border-slate-800 bg-slate-950/80 backdrop-blur-xl text-white shadow-2xl">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-semibold tracking-tight text-white">Registrarse</CardTitle>
                        <CardDescription className="text-slate-400">
                            Crea tu cuenta de viajero para empezar a reservar
                        </CardDescription>
                    </CardHeader>

                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">
                            {error && (
                                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center">
                                    {error}
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="nombre" className="text-slate-300">Nombre</Label>
                                    <Input
                                        id="nombre"
                                        type="text"
                                        placeholder="Juan"
                                        required
                                        value={nombre}
                                        onChange={(e) => setNombre(e.target.value)}
                                        className="bg-slate-900/50 border-slate-800 text-white placeholder:text-slate-500 focus-visible:ring-primary focus-visible:border-primary"
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="apellidos" className="text-slate-300">Apellidos</Label>
                                    <Input
                                        id="apellidos"
                                        type="text"
                                        placeholder="Pérez"
                                        required
                                        value={apellidos}
                                        onChange={(e) => setApellidos(e.target.value)}
                                        className="bg-slate-900/50 border-slate-800 text-white placeholder:text-slate-500 focus-visible:ring-primary focus-visible:border-primary"
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-slate-300">Correo Electrónico</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="juan.perez@example.com"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="bg-slate-900/50 border-slate-800 text-white placeholder:text-slate-500 focus-visible:ring-primary focus-visible:border-primary"
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="telefono" className="text-slate-300">Teléfono (Opcional)</Label>
                                <Input
                                    id="telefono"
                                    type="tel"
                                    placeholder="+34 600 000 000"
                                    value={telefono}
                                    onChange={(e) => setTelefono(e.target.value)}
                                    className="bg-slate-900/50 border-slate-800 text-white placeholder:text-slate-500 focus-visible:ring-primary focus-visible:border-primary"
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-slate-300">Contraseña</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Mínimo 6 caracteres"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="bg-slate-900/50 border-slate-800 text-white placeholder:text-slate-500 focus-visible:ring-primary focus-visible:border-primary"
                                    disabled={isSubmitting}
                                />
                            </div>
                        </CardContent>

                        <CardFooter className="flex flex-col space-y-4">
                            <Button
                                type="submit"
                                className="w-full bg-white hover:bg-slate-200 text-slate-950 font-medium transition-all"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creando cuenta...
                                    </>
                                ) : (
                                    'Crear Cuenta'
                                )}
                            </Button>

                            <div className="text-center text-xs text-slate-400">
                                ¿Ya tienes una cuenta?{' '}
                                <Link to="/login" className="text-white hover:underline font-medium">
                                    Iniciar Sesión
                                </Link>
                            </div>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    );
}

export default Register;
