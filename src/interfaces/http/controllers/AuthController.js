/**
 * AuthController
 * 
 * This controller handles authentication-related HTTP requests.
 */
class AuthController {
    /**
     * Constructor
     * @param {CreateUser} createUserUseCase - The create user use case
     * @param {LoginUser} loginUserUseCase - The login user use case (optional)
     */
    constructor(createUserUseCase, loginUserUseCase = null) {
        this.createUserUseCase = createUserUseCase;
        this.loginUserUseCase = loginUserUseCase;
    }

    /**
     * Register a new user
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    async register(req, res, next) {
        try {
            const userData = req.body;
            const result = await this.createUserUseCase.execute(userData);

            res.status(200).json(result);
        } catch (error) {
            console.error('Registration error:', error);
            // Format error response according to the API spec
            const errorResponse = {
                status: error.errorCode || 999, // Default error code
                message: error.message || 'An unexpected error occurred',
                data: null
            };

            res.status(error.statusCode || 500).json(errorResponse);
        }
    }

    /**
     * Login a user
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    async login(req, res, next) {
        try {
            if (!this.loginUserUseCase) {
                throw new Error('Login use case not initialized');
            }

            const credentials = req.body;
            const result = await this.loginUserUseCase.execute(credentials);

            res.status(200).json(result);
        } catch (error) {
            console.error('Login error:', error);
            // Format error response according to the API spec
            const errorResponse = {
                status: error.errorCode || 999, // Default error code
                message: error.message || 'An unexpected error occurred',
                data: null
            };

            res.status(error.statusCode || 500).json(errorResponse);
        }
    }
}

module.exports = AuthController;
