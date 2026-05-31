import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { 
    Card, 
    CardHeader, 
    CardTitle, 
    CardDescription, 
    CardContent 
} from '../../components/ui/card';
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogDescription, 
    DialogFooter 
} from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Button } from '../../components/ui/button';
import { 
    Plus, 
    Search, 
    Edit, 
    Trash2, 
    Loader2, 
    User, 
    Check, 
    AlertTriangle,
    ShieldCheck,
    Contact,
    Mail,
    Phone
} from 'lucide-react';

function UsersManagement() {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');

    // estado para crear / editar
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null); // null para crear, objeto usuario para editar
    const [formData, setFormData] = useState({
        nombre: '',
        apellidos: '',
        email: '',
        password: '',
        telefono: '',
        estado: 'activo',
        tipo_usuario: 'cliente'
    });
    const [formError, setFormError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // estado para confirmación de Eliminación
    const [deletingUser, setDeletingUser] = useState(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await api.get('/admin/usuarios');
            setUsers(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const openCreateDialog = () => {
        setEditingUser(null);
        setFormData({
            nombre: '',
            apellidos: '',
            email: '',
            password: '',
            telefono: '',
            estado: 'activo',
            tipo_usuario: 'cliente'
        });
        setFormError('');
        setIsDialogOpen(true);
    };

    const openEditDialog = (userItem) => {
        setEditingUser(userItem);
        setFormData({
            nombre: userItem.nombre || '',
            apellidos: userItem.apellidos || '',
            email: userItem.email || '',
            password: '', // en blanco al editar, opcional
            telefono: userItem.telefono || '',
            estado: userItem.estado || 'activo',
            tipo_usuario: userItem.tipo_usuario || 'cliente'
        });
        setFormError('');
        setIsDialogOpen(true);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setFormError('');
        setIsSubmitting(true);

        // validaciones basicas
        if (!formData.nombre || !formData.apellidos || !formData.email) {
            setFormError('Por favor complete los campos obligatorios (Nombre, Apellidos, Email)');
            setIsSubmitting(false);
            return;
        }

        if (!editingUser && !formData.password) {
            setFormError('La contraseña es obligatoria al crear un usuario');
            setIsSubmitting(false);
            return;
        }

        const payload = { ...formData };
        if (editingUser && !formData.password) {
            delete payload.password; // quitar si está vacío al editar
        }

        try {
            if (editingUser) {
                // editar usuario existente
                await api.put(`/admin/usuarios/${editingUser.id_usuario}`, payload);
            } else {
                // crear nuevo usuario
                await api.post('/admin/usuarios', payload);
            }
            setIsDialogOpen(false);
            fetchUsers();
        } catch (error) {
            console.error('Error al guardar usuario:', error);
            setFormError(error.response?.data?.message || 'Error al guardar el usuario. Por favor, intente de nuevo.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const openDeleteConfirm = (userItem) => {
        if (currentUser && currentUser.id_usuario === userItem.id_usuario) {
            alert("No puedes eliminar tu propia cuenta de administrador.");
            return;
        }
        setDeletingUser(userItem);
        setIsDeleteOpen(true);
    };

    const handleDeleteSubmit = async () => {
        if (!deletingUser) return;
        setIsSubmitting(true);
        try {
            await api.delete(`/admin/usuarios/${deletingUser.id_usuario}`);
            setIsDeleteOpen(false);
            setDeletingUser(null);
            fetchUsers();
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
            alert(error.response?.data?.message || 'Error al eliminar el usuario.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // filtrar y ordenar usuarios localmente (administrador siempre primero)
    const filteredUsers = users.filter(userItem => {
        const matchesRole = roleFilter === 'all' || userItem.tipo_usuario === roleFilter;
        
        const fullName = `${userItem.nombre || ''} ${userItem.apellidos || ''}`.toLowerCase();
        const email = (userItem.email || '').toLowerCase();
        
        const matchesQuery = 
            fullName.includes(searchQuery.toLowerCase()) || 
            email.includes(searchQuery.toLowerCase());
            
        return matchesRole && matchesQuery;
    }).sort((a, b) => {
        if (a.tipo_usuario === 'administrador' && b.tipo_usuario !== 'administrador') return -1;
        if (b.tipo_usuario === 'administrador' && a.tipo_usuario !== 'administrador') return 1;
        return 0;
    });

    const getStatusColor = (status) => {
        switch(status) {
            case 'activo':
                return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'inactivo':
                return 'bg-slate-500/10 text-slate-455 border-slate-500/20';
            case 'suspendido':
                return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
            default:
                return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
        }
    };

    const getRoleColor = (role) => {
        switch(role) {
            case 'administrador':
                return 'bg-white text-slate-950 font-bold border-white/20 shadow-md';
            case 'cliente':
                return 'bg-slate-800/80 text-slate-300 border-slate-700/50';
            default:
                return 'bg-slate-800/80 text-slate-300 border-slate-700/50';
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* cabecera del carrito  */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Gestión de Usuarios</h1>
                    <p className="text-slate-400 text-sm">Controla las cuentas de clientes y administradores de la base de datos travel_and_routes.</p>
                </div>
                <Button 
                    onClick={openCreateDialog}
                    className="bg-white hover:bg-slate-200 text-slate-950 font-semibold gap-2 transition-all shadow-md self-start"
                >
                    <Plus className="w-4 h-4" />
                    Registrar Usuario
                </Button>
            </div>

            {/* filtros  */}
            <Card className="border-slate-800 bg-slate-900/40 text-slate-100 shadow-md">
                <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:max-w-md">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                        <Input 
                            placeholder="Buscar por nombre o correo electrónico..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 bg-slate-950 border-slate-800 text-white placeholder:text-slate-500 focus-visible:ring-primary"
                        />
                    </div>
                    
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider shrink-0">Filtrar Rol:</span>
                        <select 
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="bg-slate-950 border border-slate-800 text-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-slate-700 w-full md:w-48"
                        >
                            <option value="all">Todos los roles</option>
                            <option value="cliente">Cliente</option>
                            <option value="administrador">Administrador</option>
                        </select>
                    </div>
                </CardContent>
            </Card>

            {/* listado de usuarios  */}
            {loading ? (
                <div className="h-[40vh] flex flex-col items-center justify-center gap-4 text-slate-400">
                    <Loader2 className="w-8 h-8 animate-spin text-white" />
                    <p className="text-sm">Obteniendo cuentas registradas...</p>
                </div>
            ) : (
                <Card className="border-slate-800 bg-slate-900/40 text-slate-100 shadow-md">
                    <CardContent className="p-0">
                        <div className="max-h-[600px] overflow-y-auto overflow-x-auto">
                            <table className="w-full text-left text-sm text-slate-350">
                                <thead className="text-xs text-slate-400 uppercase bg-slate-900/60 border-b border-slate-800">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold">ID</th>
                                        <th className="px-6 py-4 font-semibold">Usuario</th>
                                        <th className="px-6 py-4 font-semibold">Contacto</th>
                                        <th className="px-6 py-4 font-semibold text-center">Rol</th>
                                        <th className="px-6 py-4 font-semibold text-center">Estado</th>
                                        <th className="px-6 py-4 font-semibold text-center">Registro</th>
                                        <th className="px-6 py-4 font-semibold text-center">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/50">
                                    {filteredUsers.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-12 text-center text-slate-500">
                                                No se encontraron usuarios en el sistema.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredUsers.map(userItem => (
                                            <tr key={userItem.id_usuario} className="hover:bg-slate-850/30 transition-colors">
                                                <td className="px-6 py-4 font-mono font-medium text-white">#{userItem.id_usuario}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center font-bold text-white border border-slate-700/60">
                                                            {userItem.nombre?.[0]?.toUpperCase() || 'U'}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="font-semibold text-white">{userItem.nombre} {userItem.apellidos}</span>
                                                            <span className="text-[10px] text-slate-500 font-medium">Último acceso: {userItem.ultimo_acceso ? new Date(userItem.ultimo_acceso).toLocaleDateString() : 'Nunca'}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col text-xs text-slate-400 gap-0.5">
                                                        <span className="flex items-center gap-1.5"><Mail className="w-3 h-3 text-slate-500" /> {userItem.email}</span>
                                                        <span className="flex items-center gap-1.5"><Phone className="w-3 h-3 text-slate-500" /> {userItem.telefono || 'N/A'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${getRoleColor(userItem.tipo_usuario)}`}>
                                                        {userItem.tipo_usuario === 'administrador' ? (
                                                            <ShieldCheck className="w-3 h-3 mr-1 text-slate-950" />
                                                        ) : (
                                                            <User className="w-3 h-3 mr-1 text-slate-400" />
                                                        )}
                                                        {userItem.tipo_usuario}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border uppercase ${getStatusColor(userItem.estado)}`}>
                                                        {userItem.estado}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center text-xs text-slate-450">
                                                    {userItem.fecha_registro ? new Date(userItem.fecha_registro).toLocaleDateString() : 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <div className="flex items-center justify-center gap-1">
                                                        <Button 
                                                            variant="ghost" 
                                                            size="icon" 
                                                            onClick={() => openEditDialog(userItem)}
                                                            className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800/60"
                                                            title="Editar Usuario"
                                                        >
                                                            <Edit className="w-3.5 h-3.5" />
                                                        </Button>
                                                        <Button 
                                                            variant="ghost" 
                                                            size="icon" 
                                                            onClick={() => openDeleteConfirm(userItem)}
                                                            className={`h-8 w-8 ${currentUser && currentUser.id_usuario === userItem.id_usuario ? 'opacity-30 cursor-not-allowed text-slate-600' : 'text-slate-400 hover:text-rose-400 hover:bg-rose-500/10'}`}
                                                            disabled={currentUser && currentUser.id_usuario === userItem.id_usuario}
                                                            title={currentUser && currentUser.id_usuario === userItem.id_usuario ? "No puedes eliminarte a ti mismo" : "Eliminar Usuario"}
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </Button>
                                                    </div>
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

            {/* modal crear / editar  */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="bg-slate-900 border-slate-850 text-white max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold">
                            {editingUser ? 'Editar Cuenta de Usuario' : 'Registrar Nuevo Usuario'}
                        </DialogTitle>
                        <DialogDescription className="text-slate-400 text-xs">
                            Establece el rol, datos principales y estado de la cuenta en la base de datos.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleFormSubmit} className="space-y-4 py-2">
                        {formError && (
                            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs text-center">
                                {formError}
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="nombre" className="text-slate-350 text-xs font-semibold">Nombre *</Label>
                                <Input 
                                    id="nombre"
                                    name="nombre"
                                    placeholder="Juan"
                                    required
                                    value={formData.nombre}
                                    onChange={handleInputChange}
                                    className="bg-slate-950 border-slate-800 focus-visible:ring-primary focus-visible:border-primary text-sm"
                                    disabled={isSubmitting}
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="apellidos" className="text-slate-350 text-xs font-semibold">Apellidos *</Label>
                                <Input 
                                    id="apellidos"
                                    name="apellidos"
                                    placeholder="Pérez"
                                    required
                                    value={formData.apellidos}
                                    onChange={handleInputChange}
                                    className="bg-slate-950 border-slate-800 focus-visible:ring-primary text-sm"
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-slate-350 text-xs font-semibold">Correo Electrónico *</Label>
                            <Input 
                                id="email"
                                name="email"
                                type="email"
                                placeholder="usuario@correo.com"
                                required
                                value={formData.email}
                                onChange={handleInputChange}
                                className="bg-slate-950 border-slate-800 focus-visible:ring-primary text-sm"
                                disabled={isSubmitting}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-slate-350 text-xs font-semibold">
                                Contraseña {editingUser ? '(dejar en blanco para no modificar)' : '*'}
                            </Label>
                            <Input 
                                id="password"
                                name="password"
                                type="password"
                                placeholder={editingUser ? "••••••••" : "Mínimo 6 caracteres"}
                                required={!editingUser}
                                value={formData.password}
                                onChange={handleInputChange}
                                className="bg-slate-950 border-slate-800 focus-visible:ring-primary text-sm"
                                disabled={isSubmitting}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="telefono" className="text-slate-350 text-xs font-semibold">Teléfono</Label>
                            <Input 
                                id="telefono"
                                name="telefono"
                                placeholder="+34 600 000 000"
                                value={formData.telefono}
                                onChange={handleInputChange}
                                className="bg-slate-950 border-slate-800 focus-visible:ring-primary text-sm"
                                disabled={isSubmitting}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="tipo_usuario" className="text-slate-350 text-xs font-semibold">Rol del Usuario</Label>
                                <select 
                                    id="tipo_usuario"
                                    name="tipo_usuario"
                                    value={formData.tipo_usuario}
                                    onChange={handleInputChange}
                                    className="bg-slate-950 border border-slate-800 text-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-slate-700 w-full"
                                    disabled={isSubmitting}
                                >
                                    <option value="cliente">Cliente</option>
                                    <option value="administrador">Administrador</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="estado" className="text-slate-350 text-xs font-semibold">Estado de Cuenta</Label>
                                <select 
                                    id="estado"
                                    name="estado"
                                    value={formData.estado}
                                    onChange={handleInputChange}
                                    className="bg-slate-950 border border-slate-800 text-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-slate-700 w-full"
                                    disabled={isSubmitting}
                                >
                                    <option value="activo">Activo</option>
                                    <option value="inactivo">Inactivo</option>
                                    <option value="suspendido">Suspendido</option>
                                </select>
                            </div>
                        </div>

                        <DialogFooter className="pt-4 border-t border-slate-850 flex items-center justify-end gap-3">
                            <Button 
                                type="button" 
                                variant="ghost" 
                                onClick={() => setIsDialogOpen(false)}
                                className="text-slate-400 hover:text-white"
                                disabled={isSubmitting}
                            >
                                Cancelar
                            </Button>
                            <Button 
                                type="submit" 
                                className="bg-white hover:bg-slate-200 text-slate-950 font-semibold"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Guardando...
                                    </>
                                ) : (
                                    'Guardar usuario'
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* modal confirmar eliminar  */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent className="bg-slate-900 border-slate-850 text-white max-w-sm">
                    <DialogHeader className="flex flex-col items-center text-center gap-3">
                        <div className="bg-rose-500/10 p-3 rounded-full border border-rose-500/20 text-rose-400">
                            <AlertTriangle className="w-6 h-6 animate-bounce" />
                        </div>
                        <DialogTitle className="text-lg font-bold">¿Eliminar este usuario?</DialogTitle>
                        <DialogDescription className="text-slate-400 text-xs">
                            Esta acción eliminará definitivamente a <strong>{deletingUser?.nombre} {deletingUser?.apellidos}</strong> de la base de datos.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex justify-center gap-3 pt-4">
                        <Button 
                            variant="ghost" 
                            onClick={() => setIsDeleteOpen(false)}
                            className="text-slate-400 hover:text-white"
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </Button>
                        <Button 
                            onClick={handleDeleteSubmit}
                            className="bg-rose-600 hover:bg-rose-500 text-white font-semibold"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                'Sí, eliminar'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default UsersManagement;
