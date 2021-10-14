const { Router } = require('express');
const AuthService = require('../service/auth')
const authRouter = Router();

authRouter.post('/login', async (req, res) => {
   const {user, password} = req.body;
 try {
    const token = await AuthService.login(user, password);
    res.status(200).send(token)
 } catch (err) {
  res.status(500).json(err);
 }
});

module.exports = authRouter;