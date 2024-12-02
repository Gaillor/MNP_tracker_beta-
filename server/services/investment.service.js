import db from '../database/init.js';

export class InvestmentService {
  static async getInvestments(userId, filters = {}) {
    let query = `
      SELECT 
        i.*,
        u.username as user_name
      FROM investments i
      LEFT JOIN users u ON i.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.category) {
      query += ' AND i.category = ?';
      params.push(filters.category);
    }

    if (filters.status) {
      query += ' AND i.status = ?';
      params.push(filters.status);
    }

    if (filters.startDate) {
      query += ' AND i.date_of_investment >= ?';
      params.push(filters.startDate);
    }

    if (filters.endDate) {
      query += ' AND i.date_of_investment <= ?';
      params.push(filters.endDate);
    }

    query += ' ORDER BY i.date_of_investment DESC';

    return db.prepare(query).all(...params);
  }

  static async getInvestmentById(id) {
    return db.prepare(`
      SELECT 
        i.*,
        u.username as user_name
      FROM investments i
      LEFT JOIN users u ON i.user_id = u.id
      WHERE i.id = ?
    `).get(id);
  }

  static async createInvestment(data) {
    const {
      category,
      typeOfInvestment,
      initialAmount,
      currentValue,
      dateOfInvestment,
      locationId,
      userId,
      status
    } = data;

    const result = db.prepare(`
      INSERT INTO investments (
        category,
        type_of_investment,
        initial_amount,
        current_value,
        date_of_investment,
        location_id,
        user_id,
        status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      category,
      typeOfInvestment,
      initialAmount,
      currentValue,
      dateOfInvestment,
      locationId,
      userId,
      status
    );

    return this.getInvestmentById(result.lastInsertRowid);
  }

  static async updateInvestment(id, updates) {
    const investment = await this.getInvestmentById(id);
    if (!investment) {
      throw new Error('Investissement non trouvé');
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
      params.push(id);
      db.prepare(`
        UPDATE investments 
        SET ${updateFields.join(', ')}
        WHERE id = ?
      `).run(...params);
    }

    return this.getInvestmentById(id);
  }

  static async deleteInvestment(id) {
    const investment = await this.getInvestmentById(id);
    if (!investment) {
      throw new Error('Investissement non trouvé');
    }

    return db.prepare('DELETE FROM investments WHERE id = ?').run(id);
  }

  static async getInvestmentStats(userId) {
    const stats = db.prepare(`
      SELECT 
        COUNT(*) as total_investments,
        SUM(initial_amount) as total_invested,
        SUM(current_value) as total_current_value,
        SUM(current_value - initial_amount) as total_profit_loss,
        (SUM(current_value - initial_amount) / SUM(initial_amount) * 100) as roi_percentage
      FROM investments
      WHERE user_id = ?
    `).get(userId);

    const categoryDistribution = db.prepare(`
      SELECT 
        category,
        COUNT(*) as count,
        SUM(current_value) as total_value
      FROM investments
      WHERE user_id = ?
      GROUP BY category
    `).all(userId);

    return {
      ...stats,
      categoryDistribution
    };
  }

  static async getInvestmentPerformance(investmentId, period = 'monthly') {
    // Note: In a real application, you would have a separate table
    // to track historical values and calculate actual performance
    const investment = await this.getInvestmentById(investmentId);
    if (!investment) {
      throw new Error('Investissement non trouvé');
    }

    // For demo purposes, we'll generate some mock performance data
    const performanceData = [];
    const startDate = new Date(investment.date_of_investment);
    const endDate = new Date();
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      performanceData.push({
        date: new Date(currentDate),
        value: investment.current_value * (1 + Math.random() * 0.1)
      });

      if (period === 'daily') {
        currentDate.setDate(currentDate.getDate() + 1);
      } else if (period === 'weekly') {
        currentDate.setDate(currentDate.getDate() + 7);
      } else {
        currentDate.setMonth(currentDate.getMonth() + 1);
      }
    }

    return performanceData;
  }
}