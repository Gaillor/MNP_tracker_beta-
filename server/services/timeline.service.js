import db from '../database/init.js';

export class TimelineService {
  static async getEvents(filters = {}) {
    let query = `
      SELECT 
        t.*,
        u.username as user_name,
        i.type_of_investment as investment_name,
        l.unique_identifier as livestock_identifier
      FROM timeline_events t
      LEFT JOIN users u ON t.user_id = u.id
      LEFT JOIN investments i ON t.investment_id = i.id
      LEFT JOIN livestock l ON t.livestock_id = l.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.type) {
      query += ' AND t.type = ?';
      params.push(filters.type);
    }

    if (filters.category) {
      query += ' AND t.category = ?';
      params.push(filters.category);
    }

    if (filters.visibilityLevel) {
      query += ' AND t.visibility_level = ?';
      params.push(filters.visibilityLevel);
    }

    if (filters.startDate) {
      query += ' AND t.event_date >= ?';
      params.push(filters.startDate);
    }

    if (filters.endDate) {
      query += ' AND t.event_date <= ?';
      params.push(filters.endDate);
    }

    if (filters.userId) {
      query += ' AND t.user_id = ?';
      params.push(filters.userId);
    }

    query += ' ORDER BY t.event_date DESC, t.created_at DESC';

    return db.prepare(query).all(...params);
  }

  static async getEventById(id) {
    return db.prepare(`
      SELECT 
        t.*,
        u.username as user_name,
        i.type_of_investment as investment_name,
        l.unique_identifier as livestock_identifier
      FROM timeline_events t
      LEFT JOIN users u ON t.user_id = u.id
      LEFT JOIN investments i ON t.investment_id = i.id
      LEFT JOIN livestock l ON t.livestock_id = l.id
      WHERE t.id = ?
    `).get(id);
  }

  static async createEvent(data) {
    const {
      title,
      description,
      eventDate,
      type,
      category,
      investmentId,
      livestockId,
      locationId,
      userId,
      mediaUrls,
      visibilityLevel
    } = data;

    const result = db.prepare(`
      INSERT INTO timeline_events (
        title,
        description,
        event_date,
        type,
        category,
        investment_id,
        livestock_id,
        location_id,
        user_id,
        media_urls,
        visibility_level
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      title,
      description,
      eventDate,
      type,
      category,
      investmentId,
      livestockId,
      locationId,
      userId,
      mediaUrls ? JSON.stringify(mediaUrls) : null,
      visibilityLevel
    );

    return this.getEventById(result.lastInsertRowid);
  }

  static async updateEvent(id, updates) {
    const event = await this.getEventById(id);
    if (!event) {
      throw new Error('Événement non trouvé');
    }

    const updateFields = [];
    const params = [];

    Object.entries(updates).forEach(([key, value]) => {
      const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
      if (value !== undefined && value !== null) {
        if (key === 'mediaUrls') {
          updateFields.push(`${dbKey} = ?`);
          params.push(JSON.stringify(value));
        } else {
          updateFields.push(`${dbKey} = ?`);
          params.push(value);
        }
      }
    });

    if (updateFields.length > 0) {
      updateFields.push('updated_at = CURRENT_TIMESTAMP');
      params.push(id);
      db.prepare(`
        UPDATE timeline_events 
        SET ${updateFields.join(', ')}
        WHERE id = ?
      `).run(...params);
    }

    return this.getEventById(id);
  }

  static async deleteEvent(id) {
    const event = await this.getEventById(id);
    if (!event) {
      throw new Error('Événement non trouvé');
    }

    return db.prepare('DELETE FROM timeline_events WHERE id = ?').run(id);
  }

  static async getTimelineStats(userId) {
    const stats = db.prepare(`
      SELECT 
        COUNT(*) as total_events,
        COUNT(DISTINCT type) as unique_types,
        COUNT(DISTINCT category) as unique_categories,
        COUNT(DISTINCT DATE(event_date)) as active_days
      FROM timeline_events
      WHERE user_id = ?
    `).get(userId);

    const typeDistribution = db.prepare(`
      SELECT 
        type,
        COUNT(*) as count
      FROM timeline_events
      WHERE user_id = ?
      GROUP BY type
    `).all(userId);

    const categoryDistribution = db.prepare(`
      SELECT 
        category,
        COUNT(*) as count
      FROM timeline_events
      WHERE user_id = ?
      GROUP BY category
    `).all(userId);

    const recentActivity = db.prepare(`
      SELECT 
        DATE(event_date) as date,
        COUNT(*) as count
      FROM timeline_events
      WHERE user_id = ? AND event_date >= date('now', '-30 days')
      GROUP BY DATE(event_date)
      ORDER BY date DESC
    `).all(userId);

    return {
      ...stats,
      typeDistribution,
      categoryDistribution,
      recentActivity
    };
  }
}