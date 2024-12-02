import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import db from '../database/init.js';

export class AuthService {
  static async login(email, password) {
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    // TODO: Implement proper password hashing in production
    if (password !== user.password) {
      throw new Error('Mot de passe incorrect');
    }

    // Update last login
    db.prepare('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?').run(user.id);

    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email,
        role: user.role,
        permissions: JSON.parse(user.permissions || '[]')
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        permissions: JSON.parse(user.permissions || '[]'),
        isActive: user.is_active
      },
      token
    };
  }

  static async validateToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = db.prepare('SELECT * FROM users WHERE id = ?').get(decoded.id);

      if (!user || !user.is_active) {
        throw new Error('Utilisateur non trouvé ou inactif');
      }

      return {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        permissions: JSON.parse(user.permissions || '[]'),
        isActive: user.is_active
      };
    } catch (error) {
      throw new Error('Token invalide');
    }
  }
}