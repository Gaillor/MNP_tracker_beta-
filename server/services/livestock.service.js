import db from '../database/init.js';

export class LivestockService {
  static async getLivestock(filters = {}) {
    let query = `
      SELECT 
        l.*,
        i.type_of_investment as investment_name
      FROM livestock l
      LEFT JOIN investments i ON l.investment_id = i.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.type) {
      query += ' AND l.type = ?';
      params.push(filters.type);
    }

    if (filters.status) {
      query += ' AND l.current_status = ?';
      params.push(filters.status);
    }

    if (filters.investmentId) {
      query += ' AND l.investment_id = ?';
      params.push(filters.investmentId);
    }

    query += ' ORDER BY l.acquisition_date DESC';

    return db.prepare(query).all(...params);
  }

  static async getLivestockById(id) {
    return db.prepare(`
      SELECT 
        l.*,
        i.type_of_investment as investment_name
      FROM livestock l
      LEFT JOIN investments i ON l.investment_id = i.id
      WHERE l.id = ?
    `).get(id);
  }

  static async createLivestock(data) {
    const {
      uniqueIdentifier,
      type,
      race,
      dateOfBirth,
      gender,
      acquisitionDate,
      acquisitionPrice,
      currentStatus,
      investmentId
    } = data;

    // Vérifier si l'identifiant unique existe déjà
    const existing = db.prepare(
      'SELECT id FROM livestock WHERE unique_identifier = ?'
    ).get(uniqueIdentifier);

    if (existing) {
      throw new Error('Un animal avec cet identifiant existe déjà');
    }

    const result = db.prepare(`
      INSERT INTO livestock (
        unique_identifier,
        type,
        race,
        date_of_birth,
        gender,
        acquisition_date,
        acquisition_price,
        current_status,
        investment_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      uniqueIdentifier,
      type,
      race,
      dateOfBirth,
      gender,
      acquisitionDate,
      acquisitionPrice,
      currentStatus,
      investmentId
    );

    return this.getLivestockById(result.lastInsertRowid);
  }

  static async updateLivestock(id, updates) {
    const livestock = await this.getLivestockById(id);
    if (!livestock) {
      throw new Error('Animal non trouvé');
    }

    if (updates.uniqueIdentifier && updates.uniqueIdentifier !== livestock.unique_identifier) {
      const existing = db.prepare(
        'SELECT id FROM livestock WHERE unique_identifier = ? AND id != ?'
      ).get(updates.uniqueIdentifier, id);

      if (existing) {
        throw new Error('Un animal avec cet identifiant existe déjà');
      }
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
        UPDATE livestock 
        SET ${updateFields.join(', ')}
        WHERE id = ?
      `).run(...params);
    }

    return this.getLivestockById(id);
  }

  static async deleteLivestock(id) {
    const livestock = await this.getLivestockById(id);
    if (!livestock) {
      throw new Error('Animal non trouvé');
    }

    return db.prepare('DELETE FROM livestock WHERE id = ?').run(id);
  }

  static async getLivestockStats() {
    const stats = db.prepare(`
      SELECT 
        COUNT(*) as total_count,
        SUM(CASE WHEN current_status = 'healthy' THEN 1 ELSE 0 END) as healthy_count,
        SUM(CASE WHEN current_status = 'sick' THEN 1 ELSE 0 END) as sick_count,
        SUM(CASE WHEN current_status = 'deceased' THEN 1 ELSE 0 END) as deceased_count,
        SUM(acquisition_price) as total_investment,
        AVG(acquisition_price) as avg_price
      FROM livestock
    `).get();

    const typeDistribution = db.prepare(`
      SELECT 
        type,
        COUNT(*) as count
      FROM livestock
      GROUP BY type
    `).all();

    const statusDistribution = db.prepare(`
      SELECT 
        current_status,
        COUNT(*) as count
      FROM livestock
      GROUP BY current_status
    `).all();

    return {
      ...stats,
      typeDistribution,
      statusDistribution
    };
  }

  static async getHealthHistory(livestockId) {
    // Note: Dans une application réelle, vous auriez une table séparée
    // pour suivre l'historique de santé de chaque animal
    const livestock = await this.getLivestockById(livestockId);
    if (!livestock) {
      throw new Error('Animal non trouvé');
    }

    // Pour la démo, nous générons des données fictives
    const startDate = new Date(livestock.date_of_birth);
    const endDate = new Date();
    const healthHistory = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      healthHistory.push({
        date: new Date(currentDate),
        status: Math.random() > 0.2 ? 'healthy' : 'sick',
        notes: 'Contrôle de routine'
      });

      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    return healthHistory;
  }
}