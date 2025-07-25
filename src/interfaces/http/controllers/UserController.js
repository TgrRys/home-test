/**
 * UserController
 * 
 * This controller handles HTTP requests related to users.
 */
class UserController {
    /**
     * Constructor
     * @param {CreateUser} createUserUseCase - The create user use case
     * @param {GetUser} getUserUseCase - The get user use case
     */
    constructor(createUserUseCase, getUserUseCase) {
        this.createUserUseCase = createUserUseCase;
        this.getUserUseCase = getUserUseCase;
    }

    /**
     * Create a new user
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    async createUser(req, res, next) {
        try {
            const userData = req.body;
            const user = await this.createUserUseCase.execute(userData);

            res.status(201).json({
                status: 0,
                message: "Registration successful, please log in",
                data: null
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get a user by ID
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    async getUser(req, res, next) {
        try {
            const { id } = req.params;
            const user = await this.getUserUseCase.execute(id);

            res.status(200).json({
                status: 0,
                message: "User retrieved successfully",
                data: user.toJSON()
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = UserController;
