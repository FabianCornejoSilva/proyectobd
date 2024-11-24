import pool from '../../../lib/postgresql';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Método no permitido' });
    }

    try {
        const { email, password } = req.body;
        
        // Validaciones básicas y asegurar que sean strings
        if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
            return res.status(400).json({
                success: false,
                message: 'Email y contraseña son requeridos y deben ser texto'
            });
        }

        // Consulta para verificar si existe el usuario y obtener su contraseña
        const queryVerificarUsuario = {
            text: `
                SELECT 
                    correo as email, 
                    contraseña as password 
                FROM usuario 
                WHERE correo = $1
            `,
            values: [email.trim()]
        };

        const resultado = await pool.query(queryVerificarUsuario);

        // Si no existe el usuario
        if (resultado.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        const usuario = resultado.rows[0];

        // Verificar si la contraseña coincide
        if (password.trim() !== usuario.password) {
            return res.status(401).json({
                success: false,
                message: 'Contraseña incorrecta'
            });
        }

        // Si todo está correcto, generar token
        const token = jwt.sign(
            { email: usuario.email },
            process.env.JWT_SECRET || 'tu_clave_secreta_temporal',
            { expiresIn: '8h' }
        );

        // Devolver respuesta exitosa
        return res.status(200).json({
            success: true,
            message: 'Inicio de sesión exitoso',
            token,
            user: {
                email: usuario.email
            }
        });

    } catch (error) {
        console.error('Error en el proceso de login:', error);
        return res.status(500).json({
            success: false,
            message: 'Error en el servidor',
            error: error.message
        });
    }
}