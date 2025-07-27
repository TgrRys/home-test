const express = require('express');
const UserController = require('../controllers/UserController');
const CreateUser = require('../../../application/use_cases/CreateUser');
const GetUser = require('../../../application/use_cases/GetUser');
const PostgresUserRepository = require('../../../infrastructure/repositories/PostgresUserRepository');
const { Database } = require('../../../infrastructure/database/connection');

const router = express.Router();

const userRepository = new PostgresUserRepository(Database);
const createUserUseCase = new CreateUser(userRepository);
const getUserUseCase = new GetUser(userRepository);
const userController = new UserController(createUserUseCase, getUserUseCase);

router.post('/', (req, res, next) => userController.createUser(req, res, next));
router.get('/:id', (req, res, next) => userController.getUser(req, res, next));

module.exports = router;
