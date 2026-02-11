DROP DATABASE if exists travel_and_routes;
CREATE DATABASE travel_and_routes;
USE travel_and_routes;
-- TABLA DE USUARIOS
CREATE TABLE usuarios (
id_usuario INT PRIMARY KEY AUTO_INCREMENT,
nombre VARCHAR(100) NOT NULL,
apellidos VARCHAR(100) NOT NULL,
email VARCHAR(150) UNIQUE NOT NULL,
password VARCHAR(255) NOT NULL,
telefono VARCHAR(20),
fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
ultimo_acceso DATETIME,
estado ENUM('activo', 'inactivo', 'suspendido') DEFAULT 'activo',
tipo_usuario ENUM('cliente', 'administrador') DEFAULT 'cliente'
);
-- TABLA DE SERVICIOS
CREATE TABLE servicios (
id_servicio INT PRIMARY KEY AUTO_INCREMENT,
nombre VARCHAR(200) NOT NULL,
descripcion TEXT,
tipo_servicio ENUM('paquete_turistico', 'hotel','transporte', 'actividad' ,'otros'),
destino VARCHAR(150),
precio DECIMAL(10, 2) NOT NULL,
duracion_dias INT,
imagen_url VARCHAR(255),
fecha_inicio DATE,
fecha_fin DATE,
estado ENUM('activo', 'inactivo', 'agotado') DEFAULT 'activo',
fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
fecha_modificacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP);

-- TABLA DE CARRITO
CREATE TABLE carrito (
id_carrito INT PRIMARY KEY AUTO_INCREMENT,
id_usuario INT NOT NULL,
id_servicio INT NOT NULL,
cantidad INT DEFAULT 1,
fecha_agregado DATETIME DEFAULT CURRENT_TIMESTAMP,
fecha_viaje DATE,
num_personas INT DEFAULT 1,
observaciones TEXT,
FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
FOREIGN KEY (id_servicio) REFERENCES servicios(id_servicio) ON DELETE CASCADE
);
-- TABLA DE PEDIDOS
CREATE TABLE pedidos (
id_pedido INT PRIMARY KEY AUTO_INCREMENT,
id_usuario INT NOT NULL,
fecha_pedido DATETIME DEFAULT CURRENT_TIMESTAMP,
total DECIMAL(10, 2) NOT NULL,
estado_pedido ENUM('pendiente', 'confirmado', 'completado', 'cancelado') DEFAULT 'pendiente',
metodo_pago ENUM('tarjeta_credito', 'tarjeta_debito', 'transferencia', 'paypal') NOT NULL,
estado_pago ENUM('pendiente', 'aprobado', 'rechazado', 'reembolsado') DEFAULT 'pendiente',
FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);
-- TABLA DE DETALLES DE PEDIDO
CREATE TABLE detalle_pedido (
id_detalle INT PRIMARY KEY AUTO_INCREMENT,
id_pedido INT NOT NULL,
id_servicio INT NOT NULL,
cantidad INT NOT NULL,
precio_unitario DECIMAL(10, 2) NOT NULL,
subtotal DECIMAL(10, 2) NOT NULL,
fecha_viaje DATE,
num_personas INT DEFAULT 1,
FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido) ON DELETE CASCADE,
FOREIGN KEY (id_servicio) REFERENCES servicios(id_servicio)
);
-- TABLA DE DATOS DE PAGO
CREATE TABLE pagos (
id_pago INT PRIMARY KEY AUTO_INCREMENT,
id_pedido INT NOT NULL,
proveedor ENUM('stripe','paypal','mercadopago','transferencia'),
referencia_externa VARCHAR(150) NOT NULL,
monto DECIMAL(10,2) NOT NULL,
moneda VARCHAR(10) DEFAULT 'EUR',
estado_transaccion ENUM('pendiente','aprobado','rechazado','reembolsado') DEFAULT 'pendiente',
fecha_pago DATETIME,
creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido) ON DELETE CASCADE
);
-- TABLA DE FACTURAS
CREATE TABLE facturas (
id_factura INT PRIMARY KEY AUTO_INCREMENT,
id_pedido INT UNIQUE NOT NULL,
numero_factura VARCHAR(50) UNIQUE NOT NULL,
fecha_emision DATETIME DEFAULT CURRENT_TIMESTAMP,
email_enviado BOOLEAN DEFAULT FALSE,
fecha_envio_email DATETIME,
ruta_pdf VARCHAR(255),
FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido)
);
-- TABLA DE CAMBIOS EN LA WEB
CREATE TABLE cambios_web (
id_cambio INT PRIMARY KEY AUTO_INCREMENT,
id_administrador INT NOT NULL,
id_servicio INT,
accion ENUM('crear', 'modificar', 'eliminar') NOT NULL,
fecha_accion DATETIME DEFAULT CURRENT_TIMESTAMP,
datos_anteriores JSON,
datos_nuevos JSON,
FOREIGN KEY (id_administrador) REFERENCES usuarios(id_usuario),
FOREIGN KEY (id_servicio) REFERENCES servicios(id_servicio) ON DELETE SET NULL
);
-- TABLA DE CHAT/CONVERSACIONES
CREATE TABLE conversaciones_chat (
id_conversacion INT PRIMARY KEY AUTO_INCREMENT,
id_usuario INT NOT NULL,
id_administrador INT,
fecha_inicio DATETIME DEFAULT CURRENT_TIMESTAMP,
fecha_fin DATETIME,
estado ENUM('abierta', 'en_proceso', 'cerrada') DEFAULT 'abierta',
calificacion INT CHECK (calificacion BETWEEN 1 AND 5),
comentario_calificacion TEXT,
FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
FOREIGN KEY (id_administrador) REFERENCES usuarios(id_usuario)
);
CREATE TABLE mensajes_chat (
id_mensaje INT PRIMARY KEY AUTO_INCREMENT,
id_conversacion INT NOT NULL,
id_remitente INT NOT NULL,
mensaje TEXT NOT NULL,
fecha_envio DATETIME DEFAULT CURRENT_TIMESTAMP,
leido BOOLEAN DEFAULT FALSE,
FOREIGN KEY (id_conversacion) REFERENCES conversaciones_chat(id_conversacion) ON DELETE
CASCADE,
FOREIGN KEY (id_remitente) REFERENCES usuarios(id_usuario)
);
-- DATOS DE EJEMPLO
INSERT INTO usuarios (nombre, apellidos, email, password, tipo_usuario)
VALUES ('Admin', 'Sistema', 'admin@travelandroutes.com', '1234', 'administrador');
INSERT INTO usuarios (nombre, apellidos, email, password, telefono, tipo_usuario)
VALUES ('Kevin', 'Delgado', 'kevin@gmail.com', '1234', '612345678', 'cliente');
INSERT INTO servicios (nombre, descripcion, tipo_servicio, destino, precio, duracion_dias, estado)
VALUES
('Paquete París Romántico', 'Viaje completo a París con hotel 4 estrellas y tours incluidos',
'paquete_turistico', 'París, Francia', 1299.99, 5, 'activo'),
('Hotel Playa Caribe', 'Resort todo incluido en Cancún', 'hotel', 'Cancún, México', 899.50, 7, 'activo'),
('Tour Sagrada Familia', 'Visita guiada a la Sagrada Familia de Barcelona', 'hotel', 'Barcelona,
España', 45.00, 1, 'activo'),
('Vuelo Madrid-Roma', 'Vuelo directo ida y vuelta', 'transporte', 'Roma, Italia', 210.00, 0, 'activo');