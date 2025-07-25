const express = require('express');
const userRoutes = require('./userRoutes');
const authRoutes = require('./authRoutes');
const authenticateJWT = require('../middlewares/authenticateJWT');
const { processSingleImageUpload } = require('../../../infrastructure/middlewares/fileUpload');

const router = express.Router();

// API routes
router.use('/users', userRoutes);
router.post('/registration', (req, res, next) => {
    const AuthController = require('../controllers/AuthController');
    const CreateUser = require('../../../application/use_cases/CreateUser');
    const PostgresUserRepository = require('../../../infrastructure/repositories/PostgresUserRepository');

    const userRepository = new PostgresUserRepository();
    const createUserUseCase = new CreateUser(userRepository);
    const authController = new AuthController(createUserUseCase);

    authController.register(req, res, next);
});

// Login route
router.post('/login', (req, res, next) => {
    const AuthController = require('../controllers/AuthController');
    const LoginUser = require('../../../application/use_cases/LoginUser');
    const PostgresUserRepository = require('../../../infrastructure/repositories/PostgresUserRepository');

    const userRepository = new PostgresUserRepository();
    const loginUserUseCase = new LoginUser(userRepository);
    const authController = new AuthController(null, loginUserUseCase);

    authController.login(req, res, next);
});

// Profile route (protected by JWT authentication)
router.get('/profile', authenticateJWT, (req, res, next) => {
    const ProfileController = require('../controllers/ProfileController');
    const GetUserProfile = require('../../../application/use_cases/GetUserProfile');
    const PostgresUserRepository = require('../../../infrastructure/repositories/PostgresUserRepository');
    
    const userRepository = new PostgresUserRepository();
    const getUserProfileUseCase = new GetUserProfile(userRepository);
    const profileController = new ProfileController(getUserProfileUseCase);
    
    profileController.getProfile(req, res, next);
});

// Update profile route (protected by JWT authentication)
router.put('/profile/update', authenticateJWT, (req, res, next) => {
    const ProfileController = require('../controllers/ProfileController');
    const UpdateUserProfile = require('../../../application/use_cases/UpdateUserProfile');
    const PostgresUserRepository = require('../../../infrastructure/repositories/PostgresUserRepository');
    
    const userRepository = new PostgresUserRepository();
    const updateUserProfileUseCase = new UpdateUserProfile(userRepository);
    const profileController = new ProfileController(null, updateUserProfileUseCase);
    
    profileController.updateProfile(req, res, next);
});

// Update profile image route (protected by JWT authentication)
router.put('/profile/image', 
    authenticateJWT, 
    processSingleImageUpload('file'), 
    (req, res, next) => {
        const ProfileController = require('../controllers/ProfileController');
        const UpdateProfileImage = require('../../../application/use_cases/UpdateProfileImage');
        const PostgresUserRepository = require('../../../infrastructure/repositories/PostgresUserRepository');
        
        const userRepository = new PostgresUserRepository();
        const updateProfileImageUseCase = new UpdateProfileImage(userRepository);
        const profileController = new ProfileController(null, null, updateProfileImageUseCase);
        
        profileController.updateProfileImage(req, res, next);
    }
);

// Health check route
router.get('/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'API is up and running'
    });
});

module.exports = router;
