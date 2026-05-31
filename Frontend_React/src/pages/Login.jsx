import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { Loader2 } from 'lucide-react';

function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        const result = await login(email, password);

        if (result.success) {
            if (result.user.tipo_usuario === 'administrador') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } else {
            setError(result.message);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-radial from-slate-900 via-slate-950 to-black px-4 relative overflow-hidden">
            {/* Fondo de decoración premium */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px]" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-500/5 blur-[120px]" />

            <div className="w-full max-w-md z-10 animate-in fade-in slide-in-from-bottom-8 duration-500">
                <div className="flex flex-col items-center justify-center mb-6">
                    <img
                        src="/images/logo_travel_and_routes_2.PNG"
                        alt="Travel & Routes Logo"
                        className="h-16 w-auto object-contain mb-3 transition-transform duration-300 hover:scale-105"
                    />
                    <p className="text-sm text-slate-400">Portal Administrativo y de Reservas</p>
                </div>

                <Card className="border-slate-800 bg-slate-950/80 backdrop-blur-xl text-white shadow-2xl">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-semibold tracking-tight text-white">Iniciar Sesión</CardTitle>
                        <CardDescription className="text-slate-400">
                            Ingresa tus credenciales para acceder al sistema
                        </CardDescription>
                    </CardHeader>

                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">
                            {error && (
                                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-slate-300">Correo Electrónico</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="admin@travelandroutes.com"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="bg-slate-900/50 border-slate-800 text-white placeholder:text-slate-500 focus-visible:ring-primary focus-visible:border-primary"
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="text-slate-300">Contraseña</Label>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="bg-slate-900/50 border-slate-800 text-white placeholder:text-slate-500 focus-visible:ring-primary focus-visible:border-primary"
                                    disabled={isSubmitting}
                                />
                            </div>
                        </CardContent>

                        <CardFooter className="flex flex-col space-y-4 ">
                            <Button
                                type="submit"
                                className="w-full bg-white mt-4 hover:bg-slate-200 text-slate-950 font-medium transition-all"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Iniciando sesión...
                                    </>
                                ) : (
                                    'Entrar al Dashboard'
                                )}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    );
}

export default Login;
