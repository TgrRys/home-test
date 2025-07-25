const express = require('express');
const UserController = require('../controllers/UserController');
const CreateUser = require('../../../application/use_cases/CreateUser');
const GetUser = require('../../../application/use_cases/GetUser');
const PostgresUserRepository = require('../../../infrastructure/repositories/PostgresUserRepository');

const router = express.Router();

// Initialize dependencies
const userRepository = new PostgresUserRepository();
const createUserUseCase = new CreateUser(userRepository);
const getUserUseCase = new GetUser(userRepository);
const userController = new UserController(createUserUseCase, getUserUseCase);

// User routes
router.post('/', (req, res, next) => userController.createUser(req, res, next));
router.get('/:id', (req, res, next) => userController.getUser(req, res, next));

module.exports = router;
