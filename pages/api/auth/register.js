import pool from '../../../lib/postgresql';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Método no permitido' });
    }

    try {
        const { email, password, name } = req.body;

        // Verificar si el usuario ya existe
        const checkUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (checkUser.rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'El usuario ya existe'
            });
        }

        // Encriptar contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insertar nuevo usuario
        const query = `
            INSERT INTO users (email, password, name, created_at) 
            VALUES ($1, $2, $3, NOW()) 
            RETURNING id, email, name
        `;
        const values = [email, hashedPassword, name];
        const result = await pool.query(query, values);

        return res.status(201).json({
            success: true,
            user: result.rows[0]
        });

    } catch (error) {
        console.error('Error en registro:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al procesar la solicitud',
            error: error.message
        });
    }
} 