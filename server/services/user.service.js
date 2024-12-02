import db from '../database/init.js';
import bcrypt from 'bcryptjs';

export class UserService {
  static async getUsers() {
    return db.prepare(`
      SELECT id, username, email, role, is_active, permissions, last_login, created_at
      FROM users
      ORDER BY created_at DESC
    `).all();
  }

  static async getUserById(id) {
    return db.prepare(`
      SELECT id, username, email, role, is_active, permissions, last_login, created_at
      FROM users
      WHERE id = ?
    `).get(id);
  }

  static async createUser({ username, email, password, role, permissions }) {
    const existingUser = db.prepare(
      'SELECT id FROM users WHERE email = ? OR username = ?'
    ).get(email, username);

    if (existingUser) {
      throw new Error('Un utilisateur avec cet email ou ce nom d\'utilisateur existe déjà');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = db.prepare(`
      INSERT INTO users (username, email, password, role, permissions)
      VALUES (?, ?, ?, ?, ?)
    `).run(username, email, hashedPassword, role, JSON.stringify(permissions));

    return this.getUserById(result.lastInsertRowid);
  }

  static async updateUser(id, updates) {
    const user = await this.getUserById(id);
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    if (updates.email || updates.username) {
      const existingUser = db.prepare(
        'SELECT id FROM users WHERE (email = ? OR username = ?) AND id != ?'
      ).get(updates.email || user.email, updates.username || user.username, id);

      if (existingUser) {
        throw new Error('Un utilisateur avec cet email ou ce nom d\'utilisateur existe déjà');
      }
    }

    const updateFields = [];
    const params = [];

    Object.entries(updates).forEach(([key, value]) => {
      if (key === 'password') {
        updateFields.push('password = ?');
        params.push(bcrypt.hashSync(value, 10));
      } else if (key === 'permissions') {
        updateFields.push('permissions = ?');
        params.push(JSON.stringify(value));
      } else if (['username', 'email', 'role', 'is_active'].includes(key)) {
        updateFields.push(`${key} = ?`);
        params.push(value);
      }
    });

    if (updateFields.length > 0) {
      params.push(id);
      db.prepare(`
        UPDATE users 
        SET ${updateFields.join(', ')}
        WHERE id = ?
      `).run(...params);
    }

    return this.getUserById(id);
  }

  static async deleteUser(id) {
    const user = await this.getUserById(id);
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    return db.prepare('DELETE FROM users WHERE id = ?').run(id);
  }

  static async toggleUserStatus(id) {
    const user = await this.getUserById(id);
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    return db.prepare(
      'UPDATE users SET is_active = NOT is_active WHERE id = ?'
    ).run(id);
  }
}