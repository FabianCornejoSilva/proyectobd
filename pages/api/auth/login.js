import pool from '../../../lib/postgresql';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Método no permitido' });
    }

    try {
        const { email, password } = req.body;
        console.log('Datos recibidos en el backend:', { email, password });
        
        // Validar que se proporcionaron email y password
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email y contraseña son requeridos'
            });
        }

        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Formato de email inválido'
            });
        }

        // Consulta a PostgreSQL para verificar el email
        const checkEmailQuery = {
            text: 'SELECT email FROM users WHERE email = $1',
            values: [email]
        };
        
        const emailCheck = await pool.query(checkEmailQuery);
        
        if (emailCheck.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'El correo electrónico no está registrado'
            });
        }

        // Si el email existe, obtener los datos del usuario
        const query = 'SELECT * FROM users WHERE email = $1 AND password = $2';
        const result = await pool.query(query, [email, password]);
        const user = result.rows[0];

        // Verificar si se encontró el usuario con esas credenciales
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales incorrectas'
            });
        }

        // Si llegamos aquí, las credenciales son correctas
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        return res.status(200).json({
            success: true,
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            }
        });

    } catch (error) {
        console.error('Error en login:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al procesar la solicitud',
            error: error.message
        });
    }
}
