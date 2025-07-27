const express = require('express');
const ProfileController = require('../controllers/ProfileController');
const GetUserProfile = require('../../../application/use_cases/GetUserProfile');
const UpdateUserProfile = require('../../../application/use_cases/UpdateUserProfile');
const UpdateProfileImage = require('../../../application/use_cases/UpdateProfileImage');
const PostgresUserRepository = require('../../../infrastructure/repositories/PostgresUserRepository');
const authenticateJWT = require('../middlewares/authenticateJWT');
const { processSingleImageUpload } = require('../../../infrastructure/middlewares/fileUpload');
const { Database } = require('../../../infrastructure/database/connection');

const router = express.Router();

const userRepository = new PostgresUserRepository(Database);
const getUserProfileUseCase = new GetUserProfile(userRepository);
const updateUserProfileUseCase = new UpdateUserProfile(userRepository);
const updateProfileImageUseCase = new UpdateProfileImage(userRepository);
const profileController = new ProfileController(getUserProfileUseCase, updateUserProfileUseCase, updateProfileImageUseCase);

router.use(authenticateJWT);

router.get('/', profileController.getProfile.bind(profileController));
router.put('/update', profileController.updateProfile.bind(profileController));
router.put('/image', processSingleImageUpload('file'), profileController.updateProfileImage.bind(profileController));

module.exports = router;
