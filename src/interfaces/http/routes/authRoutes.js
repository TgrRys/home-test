const express = require('express');
const AuthController = require('../controllers/AuthController');
const CreateUser = require('../../../application/use_cases/CreateUser');
const LoginUser = require('../../../application/use_cases/LoginUser');
const PostgresUserRepository = require('../../../infrastructure/repositories/PostgresUserRepository');
const { Database } = require('../../../infrastructure/database/connection');

const router = express.Router();

const userRepository = new PostgresUserRepository(Database);
const createUserUseCase = new CreateUser(userRepository);
const loginUserUseCase = new LoginUser(userRepository);
const authController = new AuthController(createUserUseCase, loginUserUseCase);

router.post('/registration', authController.register.bind(authController));
router.post('/login', authController.login.bind(authController));

module.exports = router;
