import UserController from '#app/controllers/user.controller.js';

export default function(router) {
  const userController = new UserController();

  const wrap = fn => (...args) => fn(...args).catch(args[2]);

  router.get('/', wrap((req, res) => userController.users(req, res)));
  router.post('/create', wrap((req, res) => userController.create(req, res)));
  
  return router;
}