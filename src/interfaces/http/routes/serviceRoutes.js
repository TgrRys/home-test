const express = require('express');
const ServiceController = require('../controllers/ServiceController');
const GetServices = require('../../../application/use_cases/GetServices');
const PostgresServiceRepository = require('../../../infrastructure/repositories/PostgresServiceRepository');
const authenticateJWT = require('../middlewares/authenticateJWT');
const { Database } = require('../../../infrastructure/database/connection');

const router = express.Router();

const serviceRepository = new PostgresServiceRepository(Database);
const getServicesUseCase = new GetServices(serviceRepository);
const serviceController = new ServiceController(getServicesUseCase);

router.get('/', authenticateJWT, serviceController.getServices.bind(serviceController));

module.exports = router;
