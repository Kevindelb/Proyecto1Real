import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
    SidebarProvider, 
    Sidebar, 
    SidebarContent, 
    SidebarHeader, 
    SidebarFooter, 
    SidebarGroup, 
    SidebarGroupLabel, 
    SidebarGroupContent, 
    SidebarMenu, 
    SidebarMenuItem, 
    SidebarMenuButton,
    SidebarTrigger,
    SidebarInset
} from '../ui/sidebar';
import { 
    DropdownMenu, 
    DropdownMenuTrigger, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuLabel, 
    DropdownMenuSeparator 
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { 
    LayoutDashboard, 
    Briefcase, 
    ShoppingBag, 
    LogOut, 
    User, 
    Compass, 
    Settings, 
    ChevronDown, 
    Menu, 
    Globe,
    Users 
} from 'lucide-react';

function AdminLayout() {
    const { user, token, loading, logout, isAdmin } = useAuth();
    const location = useLocation();

    // loading de sesion
    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white gap-4">
                <div className="w-12 h-12 rounded-full border-4 border-slate-700 border-t-primary animate-spin" />
                <span className="text-slate-400 text-sm tracking-wide">Cargando administrador...</span>
            </div>
        );
    }

    // redireccion a login si no es admin
    if (!token || !isAdmin()) {
        return <Navigate to="/login" replace />;
    }

    const navigationItems = [
        {
            title: "General",
            items: [
                {
                    title: "Dashboard",
                    path: "/admin",
                    icon: LayoutDashboard
                }
            ]
        },
        {
            title: "Gestión de Datos",
            items: [
                {
                    title: "Servicios (Tours)",
                    path: "/admin/services",
                    icon: Briefcase
                },
                {
                    title: "Pedidos (Reservas)",
                    path: "/admin/orders",
                    icon: ShoppingBag
                },
                {
                    title: "Usuarios",
                    path: "/admin/users",
                    icon: Users
                }
            ]
        }
    ];

    const currentPath = location.pathname;

    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full bg-slate-950 text-slate-100">
                {/* barra de navegacion lateral  */}
                <Sidebar className="border-slate-800 bg-slate-900 text-slate-200">
                    <SidebarHeader className="border-b border-slate-800 px-4 py-5 flex flex-row items-center gap-3">
                        <div className="bg-primary/20 p-2 rounded-xl border border-primary/30 text-white">
                            <Compass className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-sm tracking-wide text-white leading-tight">Travel & Routes Admin</span>
                            <span className="text-[11px] text-emerald-400 font-medium">Panel de control</span>
                        </div>
                    </SidebarHeader>

                    <SidebarContent className="py-4">
                        {navigationItems.map((group) => (
                            <SidebarGroup key={group.title}>
                                <SidebarGroupLabel className="text-slate-500 text-[10px] font-bold uppercase tracking-wider px-3 mb-2">
                                    {group.title}
                                </SidebarGroupLabel>
                                <SidebarGroupContent>
                                    <SidebarMenu>
                                        {group.items.map((item) => {
                                            const active = currentPath === item.path;
                                            return (
                                                <SidebarMenuItem key={item.title}>
                                                    <SidebarMenuButton 
                                                        asChild 
                                                        isActive={active}
                                                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 hover:bg-slate-800/60 ${active ? 'bg-white text-slate-950 hover:bg-white hover:text-slate-950 font-semibold shadow-md' : 'text-slate-400 hover:text-white'}`}
                                                    >
                                                        <Link to={item.path}>
                                                            <item.icon className="w-4 h-4 shrink-0" />
                                                            <span>{item.title}</span>
                                                        </Link>
                                                    </SidebarMenuButton>
                                                </SidebarMenuItem>
                                            );
                                        })}
                                    </SidebarMenu>
                                </SidebarGroupContent>
                            </SidebarGroup>
                        ))}
                    </SidebarContent>

                    <SidebarFooter className="border-t border-slate-800 p-4">
                        <Button 
                            variant="ghost" 
                            onClick={logout}
                            className="w-full justify-start text-slate-400 hover:text-white hover:bg-slate-800/50 gap-3 px-3 py-2.5 rounded-lg text-sm"
                        >
                            <LogOut className="w-4 h-4 text-rose-400" />
                            <span>Cerrar sesión</span>
                        </Button>
                    </SidebarFooter>
                </Sidebar>

                {/* area de contenido principal  */}
                <SidebarInset className="bg-slate-950 flex flex-col flex-1 min-w-0">
                    {/* cabecera del carrito  */}
                    <header className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
                        <div className="flex items-center gap-4">
                            <SidebarTrigger className="text-slate-400 hover:text-white" />
                            <div className="h-4 w-px bg-slate-800" />
                            <span className="text-xs text-slate-500 font-medium hidden md:inline">
                                Bienvenido de nuevo, <strong className="text-slate-300 font-semibold">{user?.nombre}</strong>
                            </span>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* volver a la web publica  */}
                            <Link to="/">
                                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white text-xs gap-2 hover:bg-slate-800/40">
                                    <Globe className="w-4 h-4" />
                                    <span>Ir a la Web</span>
                                </Button>
                            </Link>

                            <div className="h-4 w-px bg-slate-800" />

                            {/* menu de usuario  */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="flex items-center gap-2 outline-none group text-left">
                                        <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center font-bold text-xs text-white group-hover:bg-white/20 transition-all shadow-inner">
                                            {user?.nombre?.[0]?.toUpperCase() || 'A'}
                                        </div>
                                        <div className="hidden md:flex flex-col text-xs pr-1">
                                            <span className="font-semibold text-slate-200 group-hover:text-white leading-tight">{user?.nombre}</span>
                                            <span className="text-[10px] text-slate-500 font-medium leading-none">Administrador</span>
                                        </div>
                                        <ChevronDown className="w-3 h-3 text-slate-500 group-hover:text-slate-300 transition-transform" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56 bg-slate-900 border-slate-800 text-slate-200 mt-2 rounded-xl shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
                                    <DropdownMenuLabel className="px-3 py-2 text-xs text-slate-400">Mi Cuenta</DropdownMenuLabel>
                                    <DropdownMenuSeparator className="bg-slate-800" />
                                    <DropdownMenuItem className="px-3 py-2.5 hover:bg-slate-800/80 rounded-lg text-sm gap-2 cursor-pointer transition-colors focus:bg-slate-800">
                                        <User className="w-4 h-4 text-slate-400" />
                                        <span>Mi Perfil</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="px-3 py-2.5 hover:bg-slate-800/80 rounded-lg text-sm gap-2 cursor-pointer transition-colors focus:bg-slate-800">
                                        <Settings className="w-4 h-4 text-slate-400" />
                                        <span>Configuración</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="bg-slate-800" />
                                    <DropdownMenuItem 
                                        onClick={logout} 
                                        className="px-3 py-2.5 hover:bg-slate-800/80 text-rose-400 hover:text-rose-300 rounded-lg text-sm gap-2 cursor-pointer transition-colors focus:bg-slate-800 focus:text-rose-300"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span>Cerrar sesión</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </header>

                    {/* contenido de la pagina del panel  */}
                    <div className="flex-1 overflow-y-auto px-8 py-8">
                        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-500">
                            <Outlet />
                        </div>
                    </div>
                </SidebarInset>
            </div>
        </SidebarProvider>
    );
}

export default AdminLayout;
