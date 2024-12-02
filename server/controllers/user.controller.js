import { UserService } from '../services/user.service.js';
import { validateUserInput, validateUserUpdateInput } from '../validators/user.validator.js';

export class UserController {
  static async getUsers(req, res, next) {
    try {
      const users = await UserService.getUsers();
      res.json(users);
    } catch (error) {
      next(error);
    }
  }

  static async getUserById(req, res, next) {
    try {
      const user = await UserService.getUserById(parseInt(req.params.id));
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  static async createUser(req, res, next) {
    try {
      const { error } = validateUserInput(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const user = await UserService.createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }

  static async updateUser(req, res, next) {
    try {
      const { error } = validateUserUpdateInput(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const user = await UserService.updateUser(parseInt(req.params.id), req.body);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  static async deleteUser(req, res, next) {
    try {
      await UserService.deleteUser(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  static async toggleUserStatus(req, res, next) {
    try {
      await UserService.toggleUserStatus(parseInt(req.params.id));
      const user = await UserService.getUserById(parseInt(req.params.id));
      res.json(user);
    } catch (error) {
      next(error);
    }
  }
}