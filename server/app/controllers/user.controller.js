import User from '#app/models/user.model.js';
import BaseController from './base.controller.js';
import app from '#core/app-service-container.js';

export default class StatController extends BaseController {

  async users(req, res) {
    const users = await User.query()
      .orderBy('id', 'desc')
      .get();

    return this.successResponse(res, null, users);
  }

  async create(req, res) {
    const data = req.body;

    this.validate(data, {
      name: 'required',
      email: 'required|email',
      age: 'required|integer',
    });

    const user = await User.create(data);

    return this.successResponse(res, 'User created', user);
  }

}

