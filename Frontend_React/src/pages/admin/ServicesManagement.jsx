import { useEffect, useState, useRef, useCallback } from 'react';
import api from '../../api/axios';
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
    Image as ImageIcon, 
    Compass, 
    Check, 
    AlertTriangle,
    Upload,
    X,
    ImagePlus
} from 'lucide-react';

const SERVICE_TYPES = [
    { value: 'paquete_turistico', label: 'Paquete Turístico' },
    { value: 'hotel', label: 'Hotel' },
    { value: 'vuelo', label: 'Vuelo' },
    { value: 'excursion', label: 'Excursión' },
    { value: 'transporte', label: 'Transporte' },
    { value: 'actividad', label: 'Actividad' },
    { value: 'otros', label: 'Otros' }
];

function ServicesManagement() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState('all');

    // estado para crear / editar
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingService, setEditingService] = useState(null); // null para crear, objeto servicio para editar
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        tipo_servicio: 'paquete_turistico',
        destino: '',
        precio: '',
        duracion_dias: '1',
        imagen_url: '',
        estado: 'activo'
    });
    const [formError, setFormError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // estado para la imagen
    const [imageFile, setImageFile] = useState(null);      // file seleccionado
    const [imagePreview, setImagePreview] = useState('');  // url de preview local
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    // estado para confirmación de Eliminación
    const [deletingService, setDeletingService] = useState(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const fetchServices = async () => {
        setLoading(true);
        try {
            const response = await api.get('/servicios');
            setServices(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error al obtener servicios:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const openCreateDialog = () => {
        setEditingService(null);
        setFormData({
            nombre: '',
            descripcion: '',
            tipo_servicio: 'paquete_turistico',
            destino: '',
            precio: '',
            duracion_dias: '1',
            imagen_url: '',
            estado: 'activo'
        });
        setImageFile(null);
        setImagePreview('');
        setFormError('');
        setIsDialogOpen(true);
    };

    // procesar archivo de imagen seleccionado
    const processImageFile = useCallback((file) => {
        if (!file) return;
        const allowed = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
        if (!allowed.includes(file.type)) {
            setFormError('Solo se permiten imágenes JPG, PNG o WEBP.');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setFormError('La imagen no puede superar los 5MB.');
            return;
        }
        setFormError('');
        setImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
    }, []);

    const handleFileInputChange = (e) => {
        processImageFile(e.target.files[0]);
        // reset el input para permitir seleccionar el mismo archivo
        e.target.value = '';
    };

    const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
    const handleDragLeave = () => setIsDragging(false);
    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        processImageFile(e.dataTransfer.files[0]);
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview('');
        setFormData(prev => ({ ...prev, imagen_url: '' }));
    };

    const openEditDialog = (service) => {
        setEditingService(service);
        setFormData({
            nombre: service.nombre || '',
            descripcion: service.descripcion || '',
            tipo_servicio: service.tipo_servicio || 'paquete_turistico',
            destino: service.destino || '',
            precio: service.precio ? service.precio.toString() : '',
            duracion_dias: service.duracion_dias ? service.duracion_dias.toString() : '1',
            imagen_url: service.imagen_url || '',
            estado: service.estado || 'activo'
        });
        setImageFile(null);
        // si ya tiene imagen guardada, mostrarla como preview
        setImagePreview(service.imagen_url || '');
        setFormError('');
        setIsDialogOpen(true);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setFormError('');
        setIsSubmitting(true);

        // validaciones basicas
        if (!formData.nombre || !formData.precio || !formData.destino) {
            setFormError('Por favor complete los campos obligatorios (Nombre, Destino, Precio)');
            setIsSubmitting(false);
            return;
        }

        try {
            if (imageFile) {
                // subir archivo usando formData
                const fd = new FormData();
                fd.append('nombre', formData.nombre);
                fd.append('descripcion', formData.descripcion || '');
                fd.append('tipo_servicio', formData.tipo_servicio);
                fd.append('destino', formData.destino);
                fd.append('precio', parseFloat(formData.precio));
                fd.append('duracion_dias', formData.duracion_dias ? parseInt(formData.duracion_dias, 10) : '');
                fd.append('estado', formData.estado);
                fd.append('imagen', imageFile);

                if (editingService) {
                    // laravel/php no procesa archivos en solicitudes patch/put directas, por lo que usamos metodo post con spoofing _method = patch
                    fd.append('_method', 'PATCH');
                    await api.post(`/servicios/${editingService.id_servicio}`, fd, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });
                } else {
                    await api.post('/servicios', fd, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });
                }
            } else {
                // enviar json normal sin archivo
                const payload = {
                    ...formData,
                    precio: parseFloat(formData.precio),
                    duracion_dias: formData.duracion_dias ? parseInt(formData.duracion_dias, 10) : null
                };
                if (editingService) {
                    await api.put(`/servicios/${editingService.id_servicio}`, payload);
                } else {
                    await api.post('/servicios', payload);
                }
            }

            setIsDialogOpen(false);
            fetchServices();
        } catch (error) {
            console.error('Error al guardar servicio:', error);
            setFormError(error.response?.data?.message || 'Error al guardar el servicio. Por favor, intente de nuevo.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const openDeleteConfirm = (service) => {
        setDeletingService(service);
        setIsDeleteOpen(true);
    };

    const handleDeleteSubmit = async () => {
        if (!deletingService) return;
        setIsSubmitting(true);
        try {
            const response = await api.delete(`/servicios/${deletingService.id_servicio}`);
            setIsDeleteOpen(false);
            setDeletingService(null);
            fetchServices();
            if (response.data && response.data.message) {
                alert(response.data.message);
            }
        } catch (error) {
            console.error('Error al eliminar servicio:', error);
            alert(error.response?.data?.message || 'Error al eliminar el servicio. Inténtelo de nuevo.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // filtrar servicios localmente
    const filteredServices = services.filter(service => {
        const matchesQuery = 
            (service.nombre || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
            (service.destino || '').toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesType = selectedType === 'all' || service.tipo_servicio === selectedType;
        
        return matchesQuery && matchesType;
    });

    const getStatusColor = (status) => {
        switch(status) {
            case 'activo':
                return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'inactivo':
                return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
            case 'agotado':
                return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
            default:
                return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
        }
    };

    return (
        <div className="space-y-8">
            {/* cabecera del carrito  */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Servicios de Viaje</h1>
                    <p className="text-slate-400 text-sm">Gestiona el catálogo de tours, paquetes, alojamientos y transportes.</p>
                </div>
                <Button 
                    onClick={openCreateDialog}
                    className="bg-white hover:bg-slate-200 text-slate-950 font-semibold gap-2 transition-all shadow-md self-start"
                >
                    <Plus className="w-4 h-4" />
                    Crear Servicio
                </Button>
            </div>

            {/* Filtros y Búsqueda */}
            <Card className="border-slate-800 bg-slate-900/40 text-slate-100 shadow-md">
                <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:max-w-md">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                        <Input 
                            placeholder="Buscar por nombre o destino..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 bg-slate-950 border-slate-800 text-white placeholder:text-slate-500 focus-visible:ring-primary"
                        />
                    </div>
                    
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider shrink-0">Filtrar Tipo:</span>
                        <select 
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            className="bg-slate-950 border border-slate-800 text-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-slate-700 transition-colors w-full md:w-48"
                        >
                            <option value="all">Todos los tipos</option>
                            {SERVICE_TYPES.map(t => (
                                <option key={t.value} value={t.value}>{t.label}</option>
                            ))}
                        </select>
                    </div>
                </CardContent>
            </Card>

            {/* listado de servicios  */}
            {loading ? (
                <div className="h-[40vh] flex flex-col items-center justify-center gap-4 text-slate-400">
                    <Loader2 className="w-8 h-8 animate-spin text-white" />
                    <p className="text-sm">Cargando catálogo de servicios...</p>
                </div>
            ) : filteredServices.length === 0 ? (
                <Card className="border-slate-850 bg-slate-900/10 py-16 text-center shadow-inner">
                    <CardContent className="flex flex-col items-center gap-3">
                        <ImageIcon className="w-12 h-12 text-slate-650" />
                        <h3 className="text-lg font-semibold text-white">No se encontraron servicios</h3>
                        <p className="text-slate-500 max-w-sm mx-auto text-sm">
                            No hay rutas cargadas que coincidan con la búsqueda. ¡Prueba a crear una nueva ahora!
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredServices.map(service => (
                        <Card 
                            key={service.id_servicio} 
                            className="border-slate-800 bg-slate-900/40 text-slate-100 shadow-md hover:shadow-xl hover:border-slate-750 transition-all flex flex-col overflow-hidden group"
                        >
                            {/* imagen  */}
                            <div className="relative h-48 bg-slate-950 flex items-center justify-center overflow-hidden">
                                <img 
                                    src={service.imagen_url && service.imagen_url.trim() !== '' ? service.imagen_url : 'http://127.0.0.1:8000/storage/servicios/no%20hay%20imagen.webp'} 
                                    alt={service.nombre} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    onError={(e) => {
                                        e.target.onError = null;
                                        e.target.src = 'http://127.0.0.1:8000/storage/servicios/no%20hay%20imagen.webp';
                                    }}
                                />
                                <span className={`absolute top-3 right-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border uppercase ${getStatusColor(service.estado)}`}>
                                    {service.estado}
                                </span>
                            </div>

                            {/* contenido  */}
                            <CardContent className="p-6 flex-1 flex flex-col justify-between">
                                <div className="space-y-2">
                                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                        {SERVICE_TYPES.find(t => t.value === service.tipo_servicio)?.label || service.tipo_servicio}
                                    </div>
                                    <h3 className="text-lg font-bold text-white leading-snug">{service.nombre}</h3>
                                    <p className="text-slate-400 text-xs line-clamp-2">{service.descripcion || 'Sin descripción disponible.'}</p>
                                    
                                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 pt-3">
                                        <div>Destino: <strong className="text-slate-300">{service.destino}</strong></div>
                                        <div>Duración: <strong className="text-slate-300">{service.duracion_dias ? `${service.duracion_dias} días` : 'N/A'}</strong></div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between border-t border-slate-800/80 pt-4 mt-5">
                                    <div className="text-lg font-extrabold text-white">
                                        €{parseFloat(service.precio).toFixed(2)}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            onClick={() => openEditDialog(service)}
                                            className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800/60"
                                            title="Editar"
                                        >
                                            <Edit className="w-3.5 h-3.5" />
                                        </Button>
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            onClick={() => openDeleteConfirm(service)}
                                            className="h-8 w-8 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10"
                                            title="Eliminar"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* modal crear / editar  */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="bg-slate-900 border-slate-850 text-white max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold">
                            {editingService ? 'Editar Servicio Turístico' : 'Crear Nuevo Servicio'}
                        </DialogTitle>
                        <DialogDescription className="text-slate-400 text-xs">
                            Rellena el formulario con los detalles del tour o servicio del catálogo.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleFormSubmit} className="space-y-4 py-2">
                        {formError && (
                            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs text-center">
                                {formError}
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="nombre" className="text-slate-350 text-xs font-semibold">Nombre del Servicio *</Label>
                            <Input 
                                id="nombre"
                                name="nombre"
                                placeholder="Paquete Cusco y Machu Picchu 5 Días"
                                required
                                value={formData.nombre}
                                onChange={handleInputChange}
                                className="bg-slate-950 border-slate-800 focus-visible:ring-primary focus-visible:border-primary text-sm"
                                disabled={isSubmitting}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="tipo_servicio" className="text-slate-350 text-xs font-semibold">Tipo de Servicio</Label>
                                <select 
                                    id="tipo_servicio"
                                    name="tipo_servicio"
                                    value={formData.tipo_servicio}
                                    onChange={handleInputChange}
                                    className="bg-slate-950 border border-slate-800 text-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-slate-700 w-full"
                                    disabled={isSubmitting}
                                >
                                    {SERVICE_TYPES.map(t => (
                                        <option key={t.value} value={t.value}>{t.label}</option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="destino" className="text-slate-350 text-xs font-semibold">Destino del Viaje *</Label>
                                <Input 
                                    id="destino"
                                    name="destino"
                                    placeholder="Cusco, Perú"
                                    required
                                    value={formData.destino}
                                    onChange={handleInputChange}
                                    className="bg-slate-950 border-slate-800 focus-visible:ring-primary text-sm"
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="precio" className="text-slate-350 text-xs font-semibold">Precio (€) *</Label>
                                <Input 
                                    id="precio"
                                    name="precio"
                                    type="number"
                                    step="0.01"
                                    placeholder="499.00"
                                    required
                                    value={formData.precio}
                                    onChange={handleInputChange}
                                    className="bg-slate-950 border-slate-800 focus-visible:ring-primary text-sm"
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="duracion_dias" className="text-slate-350 text-xs font-semibold">Duración (Días)</Label>
                                <Input 
                                    id="duracion_dias"
                                    name="duracion_dias"
                                    type="number"
                                    placeholder="5"
                                    value={formData.duracion_dias}
                                    onChange={handleInputChange}
                                    className="bg-slate-950 border-slate-800 focus-visible:ring-primary text-sm"
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>

                        {/* upload de imagen  */}
                        <div className="space-y-2">
                            <Label className="text-slate-350 text-xs font-semibold flex items-center gap-1.5">
                                <ImagePlus className="w-3.5 h-3.5" />
                                Imagen del Servicio
                            </Label>

                            {/* preview si hay imagen  */}
                            {imagePreview ? (
                                <div className="relative rounded-xl overflow-hidden border border-slate-700 bg-slate-950">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-full h-40 object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="bg-white/10 backdrop-blur border border-white/20 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-white/20 transition-colors flex items-center gap-1.5"
                                            disabled={isSubmitting}
                                        >
                                            <Upload className="w-3 h-3" /> Cambiar
                                        </button>
                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            className="bg-rose-500/20 backdrop-blur border border-rose-500/30 text-rose-400 text-xs px-3 py-1.5 rounded-lg hover:bg-rose-500/30 transition-colors flex items-center gap-1.5"
                                            disabled={isSubmitting}
                                        >
                                            <X className="w-3 h-3" /> Quitar
                                        </button>
                                    </div>
                                    {imageFile && (
                                        <div className="absolute bottom-2 left-2 bg-emerald-500/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                            <Check className="w-3 h-3" /> Nueva imagen lista
                                        </div>
                                    )}
                                </div>
                            ) : (
                                /* Zona de drop */
                                <div
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    onClick={() => !isSubmitting && fileInputRef.current?.click()}
                                    className={`
                                        relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
                                        transition-all duration-200 select-none
                                        ${
                                            isDragging
                                                ? 'border-blue-500 bg-blue-500/10 scale-[1.01]'
                                                : 'border-slate-700 bg-slate-950/60 hover:border-slate-500 hover:bg-slate-800/40'
                                        }
                                        ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}
                                    `}
                                >
                                    <div className="flex flex-col items-center gap-2 text-slate-400">
                                        <div className={`p-3 rounded-full transition-colors ${ isDragging ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-800 text-slate-500' }`}>
                                            <Upload className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-300">
                                                {isDragging ? 'Suelta la imagen aquí' : 'Arrastra una imagen o haz clic'}
                                            </p>
                                            <p className="text-xs text-slate-500 mt-0.5">JPG, PNG, WEBP — máx. 5MB</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* input oculto  */}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/png,image/jpg,image/webp"
                                onChange={handleFileInputChange}
                                className="hidden"
                                disabled={isSubmitting}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="estado" className="text-slate-350 text-xs font-semibold">Estado</Label>
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
                                    <option value="agotado">Agotado</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="descripcion" className="text-slate-350 text-xs font-semibold">Descripción del Servicio</Label>
                            <textarea 
                                id="descripcion"
                                name="descripcion"
                                rows="3"
                                placeholder="Ingresa los detalles, itinerario o comodidades del servicio..."
                                value={formData.descripcion}
                                onChange={handleInputChange}
                                className="w-full bg-slate-950 border border-slate-800 text-slate-100 text-sm rounded-lg px-3 py-2 outline-none focus:border-slate-700 transition-colors placeholder:text-slate-650"
                                disabled={isSubmitting}
                            />
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
                                    'Guardar cambios'
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
                        <DialogTitle className="text-lg font-bold">¿Eliminar este servicio?</DialogTitle>
                        <DialogDescription className="text-slate-400 text-xs">
                            Esta acción eliminará definitivamente el servicio <strong>{deletingService?.nombre}</strong> del catálogo de forma permanente.
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

export default ServicesManagement;
