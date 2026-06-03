-- Insertar un único usuario de prueba
-- Contraseña: Password123 (Hasheada con bcrypt)
INSERT INTO users (id, email, password_hash, name, role, created_at) 
VALUES (
    '11111111-1111-1111-1111-111111111111', 
    'admin@latampay.com', 
    '$2a$10$Xm57uG7YjD1r173sZ.D.y.J.U6.z41s3hXv8yK75W2V0m80/7e3gW', 
    'Facundo Admin', 
    'user', 
    '2026-06-03 12:00:00'
);