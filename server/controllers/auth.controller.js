import { AuthService } from '../services/auth.service.js';
import { validateLoginInput } from '../validators/auth.validator.js';

export class AuthController {
  static async login(req, res, next) {
    try {
      const { error } = validateLoginInput(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const { email, password } = req.body;
      const result = await AuthService.login(email, password);
      
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async validateToken(req, res, next) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ message: 'Token manquant' });
      }

      const user = await AuthService.validateToken(token);
      res.json({ user });
    } catch (error) {
      next(error);
    }
  }
}