import db from '../database/init.js';

export class TaskService {
  static async getTasks(filters = {}) {
    let query = `
      SELECT 
        t.*,
        u1.username as assigned_user,
        u2.username as creator_name,
        i.type_of_investment as investment_name
      FROM tasks t
      LEFT JOIN users u1 ON t.assigned_to = u1.id
      LEFT JOIN users u2 ON t.created_by = u2.id
      LEFT JOIN investments i ON t.investment_id = i.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.status) {
      query += ' AND t.status = ?';
      params.push(filters.status);
    }

    if (filters.priority) {
      query += ' AND t.priority = ?';
      params.push(filters.priority);
    }

    if (filters.assignedTo) {
      query += ' AND t.assigned_to = ?';
      params.push(filters.assignedTo);
    }

    if (filters.startDate) {
      query += ' AND t.start_date >= ?';
      params.push(filters.startDate);
    }

    if (filters.endDate) {
      query += ' AND t.end_date <= ?';
      params.push(filters.endDate);
    }

    query += ' ORDER BY t.priority DESC, t.start_date ASC';

    return db.prepare(query).all(...params);
  }

  static async getTaskById(id) {
    return db.prepare(`
      SELECT 
        t.*,
        u1.username as assigned_user,
        u2.username as creator_name,
        i.type_of_investment as investment_name
      FROM tasks t
      LEFT JOIN users u1 ON t.assigned_to = u1.id
      LEFT JOIN users u2 ON t.created_by = u2.id
      LEFT JOIN investments i ON t.investment_id = i.id
      WHERE t.id = ?
    `).get(id);
  }

  static async createTask(data) {
    const {
      title,
      description,
      startDate,
      endDate,
      status,
      priority,
      assignedTo,
      investmentId,
      createdBy
    } = data;

    const result = db.prepare(`
      INSERT INTO tasks (
        title,
        description,
        start_date,
        end_date,
        status,
        priority,
        assigned_to,
        investment_id,
        created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      title,
      description,
      startDate,
      endDate,
      status,
      priority,
      assignedTo,
      investmentId,
      createdBy
    );

    return this.getTaskById(result.lastInsertRowid);
  }

  static async updateTask(id, updates) {
    const task = await this.getTaskById(id);
    if (!task) {
      throw new Error('Tâche non trouvée');
    }

    const updateFields = [];
    const params = [];

    Object.entries(updates).forEach(([key, value]) => {
      const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
      if (value !== undefined && value !== null) {
        updateFields.push(`${dbKey} = ?`);
        params.push(value);
      }
    });

    if (updateFields.length > 0) {
      updateFields.push('updated_at = CURRENT_TIMESTAMP');
      params.push(id);
      db.prepare(`
        UPDATE tasks 
        SET ${updateFields.join(', ')}
        WHERE id = ?
      `).run(...params);
    }

    return this.getTaskById(id);
  }

  static async deleteTask(id) {
    const task = await this.getTaskById(id);
    if (!task) {
      throw new Error('Tâche non trouvée');
    }

    return db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
  }

  static async getTaskStats(userId) {
    const stats = db.prepare(`
      SELECT 
        COUNT(*) as total_tasks,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_count,
        SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress_count,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_count,
        SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled_count
      FROM tasks
      WHERE assigned_to = ? OR created_by = ?
    `).get(userId, userId);

    const priorityDistribution = db.prepare(`
      SELECT 
        priority,
        COUNT(*) as count
      FROM tasks
      WHERE assigned_to = ? OR created_by = ?
      GROUP BY priority
    `).all(userId, userId);

    const statusDistribution = db.prepare(`
      SELECT 
        status,
        COUNT(*) as count
      FROM tasks
      WHERE assigned_to = ? OR created_by = ?
      GROUP BY status
    `).all(userId, userId);

    const upcomingTasks = db.prepare(`
      SELECT 
        t.*,
        u1.username as assigned_user,
        i.type_of_investment as investment_name
      FROM tasks t
      LEFT JOIN users u1 ON t.assigned_to = u1.id
      LEFT JOIN investments i ON t.investment_id = i.id
      WHERE (t.assigned_to = ? OR t.created_by = ?)
        AND t.status IN ('pending', 'in_progress')
        AND t.end_date >= date('now')
      ORDER BY t.end_date ASC
      LIMIT 5
    `).all(userId, userId);

    return {
      ...stats,
      priorityDistribution,
      statusDistribution,
      upcomingTasks
    };
  }
}