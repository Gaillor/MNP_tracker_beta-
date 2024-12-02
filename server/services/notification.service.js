import db from '../database/init.js';

export class NotificationService {
  static async getNotifications(userId, filters = {}) {
    let query = `
      SELECT *
      FROM notifications
      WHERE user_id = ?
    `;
    const params = [userId];

    if (filters.type) {
      query += ' AND type = ?';
      params.push(filters.type);
    }

    if (filters.isRead !== undefined) {
      query += ' AND is_read = ?';
      params.push(filters.isRead);
    }

    query += ' ORDER BY created_at DESC';

    if (filters.limit) {
      query += ' LIMIT ?';
      params.push(filters.limit);
    }

    return db.prepare(query).all(...params);
  }

  static async createNotification(data) {
    const {
      userId,
      title,
      message,
      type,
      link,
      metadata
    } = data;

    const result = db.prepare(`
      INSERT INTO notifications (
        user_id,
        title,
        message,
        type,
        link,
        metadata,
        is_read,
        created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `).run(
      userId,
      title,
      message,
      type,
      link,
      metadata ? JSON.stringify(metadata) : null,
      false
    );

    return this.getNotificationById(result.lastInsertRowid);
  }

  static async getNotificationById(id) {
    return db.prepare('SELECT * FROM notifications WHERE id = ?').get(id);
  }

  static async markAsRead(id, userId) {
    return db.prepare(
      'UPDATE notifications SET is_read = true WHERE id = ? AND user_id = ?'
    ).run(id, userId);
  }

  static async markAllAsRead(userId) {
    return db.prepare(
      'UPDATE notifications SET is_read = true WHERE user_id = ?'
    ).run(userId);
  }

  static async deleteNotification(id, userId) {
    return db.prepare(
      'DELETE FROM notifications WHERE id = ? AND user_id = ?'
    ).run(id, userId);
  }

  static async getUnreadCount(userId) {
    const result = db.prepare(
      'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = false'
    ).get(userId);
    return result.count;
  }
}