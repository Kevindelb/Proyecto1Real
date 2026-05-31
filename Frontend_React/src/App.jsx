import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ServicesPage from './pages/ServicesPage';
import ToursPage from './pages/ToursPage';
import AboutPage from './pages/AboutPage';
import EdicionDeCuenta from './pages/EdicionDeCuenta';
import MisReservas from './pages/MisReservas';
import AdminLayout from './components/layout/AdminLayout';
import DashboardOverview from './pages/admin/DashboardOverview';
import ServicesManagement from './pages/admin/ServicesManagement';
import OrdersManagement from './pages/admin/OrdersManagement';
import UsersManagement from './pages/admin/UsersManagement';
import ScrollToTop from './components/ScrollToTop';
import WhatsAppButton from './components/WhatsAppButton';


function App() {
    return (
        <AuthProvider>
            <CartProvider>
                <Router>
                    <ScrollToTop />
                    <WhatsAppButton />
                    <Routes>
                        {/* Rutas Públicas */}
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/services" element={<ServicesPage />} />
                        <Route path="/tours" element={<ToursPage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/edit-profile" element={<EdicionDeCuenta />} />
                        <Route path="/mis-reservas" element={<MisReservas />} />

                        {/* Rutas de Administración (Protegidas) */}
                        <Route path="/admin" element={<AdminLayout />}>
                            <Route index element={<DashboardOverview />} />
                            <Route path="services" element={<ServicesManagement />} />
                            <Route path="orders" element={<OrdersManagement />} />
                            <Route path="users" element={<UsersManagement />} />
                        </Route>
                    </Routes>
                </Router>
            </CartProvider>
        </AuthProvider>
    );
}

export default App;
