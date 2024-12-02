import db from '../database/init.js';

export class ReportService {
  static async getFinancialReport(filters = {}) {
    const { startDate, endDate, userId } = filters;

    // Statistiques globales des investissements
    const investmentStats = db.prepare(`
      SELECT 
        COUNT(*) as total_investments,
        SUM(initial_amount) as total_invested,
        SUM(current_value) as total_current_value,
        SUM(current_value - initial_amount) as total_profit_loss,
        (SUM(current_value - initial_amount) / SUM(initial_amount) * 100) as roi_percentage,
        AVG(current_value - initial_amount) as avg_profit_per_investment
      FROM investments
      WHERE user_id = ?
        AND date_of_investment >= ?
        AND date_of_investment <= ?
    `).get(userId, startDate, endDate);

    // Distribution par catégorie
    const categoryDistribution = db.prepare(`
      SELECT 
        category,
        COUNT(*) as count,
        SUM(initial_amount) as total_invested,
        SUM(current_value) as current_value,
        SUM(current_value - initial_amount) as profit_loss
      FROM investments
      WHERE user_id = ?
        AND date_of_investment >= ?
        AND date_of_investment <= ?
      GROUP BY category
    `).all(userId, startDate, endDate);

    // Performance mensuelle
    const monthlyPerformance = db.prepare(`
      SELECT 
        strftime('%Y-%m', date_of_investment) as month,
        SUM(initial_amount) as invested_amount,
        SUM(current_value) as current_value,
        SUM(current_value - initial_amount) as profit_loss
      FROM investments
      WHERE user_id = ?
        AND date_of_investment >= ?
        AND date_of_investment <= ?
      GROUP BY strftime('%Y-%m', date_of_investment)
      ORDER BY month
    `).all(userId, startDate, endDate);

    return {
      investmentStats,
      categoryDistribution,
      monthlyPerformance
    };
  }

  static async getLivestockReport(filters = {}) {
    const { startDate, endDate } = filters;

    // Statistiques globales du bétail
    const livestockStats = db.prepare(`
      SELECT 
        COUNT(*) as total_livestock,
        SUM(acquisition_price) as total_investment,
        AVG(acquisition_price) as avg_price,
        COUNT(CASE WHEN current_status = 'healthy' THEN 1 END) as healthy_count,
        COUNT(CASE WHEN current_status = 'sick' THEN 1 END) as sick_count,
        COUNT(CASE WHEN current_status = 'deceased' THEN 1 END) as deceased_count
      FROM livestock
      WHERE acquisition_date >= ?
        AND acquisition_date <= ?
    `).get(startDate, endDate);

    // Distribution par type
    const typeDistribution = db.prepare(`
      SELECT 
        type,
        COUNT(*) as count,
        SUM(acquisition_price) as total_investment,
        AVG(acquisition_price) as avg_price
      FROM livestock
      WHERE acquisition_date >= ?
        AND acquisition_date <= ?
      GROUP BY type
    `).all(startDate, endDate);

    // Évolution mensuelle
    const monthlyAcquisitions = db.prepare(`
      SELECT 
        strftime('%Y-%m', acquisition_date) as month,
        COUNT(*) as count,
        SUM(acquisition_price) as investment
      FROM livestock
      WHERE acquisition_date >= ?
        AND acquisition_date <= ?
      GROUP BY strftime('%Y-%m', acquisition_date)
      ORDER BY month
    `).all(startDate, endDate);

    return {
      livestockStats,
      typeDistribution,
      monthlyAcquisitions
    };
  }

  static async getTaskReport(filters = {}) {
    const { startDate, endDate, userId } = filters;

    // Statistiques globales des tâches
    const taskStats = db.prepare(`
      SELECT 
        COUNT(*) as total_tasks,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_tasks,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_tasks,
        COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress_tasks,
        COUNT(CASE WHEN end_date < date('now') AND status != 'completed' THEN 1 END) as overdue_tasks
      FROM tasks
      WHERE (assigned_to = ? OR created_by = ?)
        AND start_date >= ?
        AND start_date <= ?
    `).get(userId, userId, startDate, endDate);

    // Distribution par priorité
    const priorityDistribution = db.prepare(`
      SELECT 
        priority,
        COUNT(*) as count,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_count
      FROM tasks
      WHERE (assigned_to = ? OR created_by = ?)
        AND start_date >= ?
        AND start_date <= ?
      GROUP BY priority
    `).all(userId, userId, startDate, endDate);

    // Performance mensuelle
    const monthlyCompletion = db.prepare(`
      SELECT 
        strftime('%Y-%m', start_date) as month,
        COUNT(*) as total_tasks,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_tasks
      FROM tasks
      WHERE (assigned_to = ? OR created_by = ?)
        AND start_date >= ?
        AND start_date <= ?
      GROUP BY strftime('%Y-%m', start_date)
      ORDER BY month
    `).all(userId, userId, startDate, endDate);

    return {
      taskStats,
      priorityDistribution,
      monthlyCompletion
    };
  }

  static async generateCompleteReport(userId, filters = {}) {
    const defaultStartDate = new Date();
    defaultStartDate.setMonth(defaultStartDate.getMonth() - 1);
    
    const reportFilters = {
      startDate: filters.startDate || defaultStartDate.toISOString().split('T')[0],
      endDate: filters.endDate || new Date().toISOString().split('T')[0],
      userId
    };

    const [financialReport, livestockReport, taskReport] = await Promise.all([
      this.getFinancialReport(reportFilters),
      this.getLivestockReport(reportFilters),
      this.getTaskReport(reportFilters)
    ]);

    return {
      period: {
        startDate: reportFilters.startDate,
        endDate: reportFilters.endDate
      },
      financial: financialReport,
      livestock: livestockReport,
      tasks: taskReport
    };
  }
}