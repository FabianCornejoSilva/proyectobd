import pool from '../../../lib/postgresql';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Método no permitido' });
    }

    try {
        const { email, password, nombre } = req.body;

        // Validaciones básicas
        if (!email || !password || !nombre || 
            typeof email !== 'string' || 
            typeof password !== 'string' || 
            typeof nombre !== 'string') {
            return res.status(400).json({
                success: false,
                message: 'Email, contraseña y nombre son requeridos y deben ser texto'
            });
        }

        // Verificar si el usuario ya existe
        const verificarUsuario = {
            text: 'SELECT correo FROM usuario WHERE correo = $1',
            values: [email.trim()]
        };

        const usuarioExistente = await pool.query(verificarUsuario);

        if (usuarioExistente.rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'El correo ya está registrado'
            });
        }

        // Insertar nuevo usuario con nombre y admin=false por defecto
        const queryInsertar = {
            text: 'INSERT INTO usuario (correo, contraseña, admin, nombre) VALUES ($1, $2, $3, $4) RETURNING correo, nombre',
            values: [email.trim(), password.trim(), false, nombre.trim()]
        };

        const resultado = await pool.query(queryInsertar);

        return res.status(201).json({
            success: true,
            message: 'Usuario registrado exitosamente',
            user: {
                email: resultado.rows[0].correo,
                nombre: resultado.rows[0].nombre
            }
        });

    } catch (error) {
        console.error('Error en registro:', error);
        return res.status(500).json({
            success: false,
            message: 'Error en el servidor',
            error: error.message
        });
    }
} 