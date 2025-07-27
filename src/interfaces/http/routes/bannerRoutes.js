const express = require('express');
const BannerController = require('../controllers/BannerController');
const GetBanners = require('../../../application/use_cases/GetBanners');
const PostgresBannerRepository = require('../../../infrastructure/repositories/PostgresBannerRepository');
const { Database } = require('../../../infrastructure/database/connection');

const router = express.Router();

const bannerRepository = new PostgresBannerRepository(Database);
const getBannersUseCase = new GetBanners(bannerRepository);
const bannerController = new BannerController(getBannersUseCase);

router.get('/', bannerController.getBanners.bind(bannerController));

module.exports = router;
