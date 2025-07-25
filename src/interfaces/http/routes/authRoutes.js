const express = require('express');
const AuthController = require('../controllers/AuthController');
const CreateUser = require('../../../application/use_cases/CreateUser');
const PostgresUserRepository = require('../../../infrastructure/repositories/PostgresUserRepository');

const router = express.Router();

// Initialize dependencies
const userRepository = new PostgresUserRepository();
const createUserUseCase = new CreateUser(userRepository);
const authController = new AuthController(createUserUseCase);

// Auth routes
router.post('/register', (req, res, next) => authController.register(req, res, next));

module.exports = router;
