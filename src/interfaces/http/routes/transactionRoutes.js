const express = require('express');
const authenticateJWT = require('../middlewares/authenticateJWT');
const { Database } = require('../../../infrastructure/database/connection');

const PostgresBalanceRepository = require('../../../infrastructure/repositories/PostgresBalanceRepository');
const PostgresTransactionRepository = require('../../../infrastructure/repositories/PostgresTransactionRepository');
const PostgresServiceRepository = require('../../../infrastructure/repositories/PostgresServiceRepository');

const GetBalance = require('../../../application/use_cases/GetBalance');
const TopUpBalance = require('../../../application/use_cases/TopUpBalance');
const CreateTransaction = require('../../../application/use_cases/CreateTransaction');
const GetTransactionHistory = require('../../../application/use_cases/GetTransactionHistory');

const TransactionController = require('../controllers/TransactionController');

const router = express.Router();

const balanceRepository = new PostgresBalanceRepository(Database);
const transactionRepository = new PostgresTransactionRepository(Database);
const serviceRepository = new PostgresServiceRepository(Database);

const getBalance = new GetBalance(balanceRepository);
const topUpBalance = new TopUpBalance(balanceRepository, transactionRepository);
const createTransaction = new CreateTransaction(balanceRepository, transactionRepository, serviceRepository);
const getTransactionHistory = new GetTransactionHistory(transactionRepository);

const transactionController = new TransactionController(
    getBalance,
    topUpBalance,
    createTransaction,
    getTransactionHistory
);

router.get('/balance', authenticateJWT, (req, res) => transactionController.getBalance(req, res));
router.post('/topup', authenticateJWT, (req, res) => transactionController.topUp(req, res));
router.post('/transaction', authenticateJWT, (req, res) => transactionController.transaction(req, res));
router.get('/transaction/history', authenticateJWT, (req, res) => transactionController.getTransactionHistory(req, res));

module.exports = router;
