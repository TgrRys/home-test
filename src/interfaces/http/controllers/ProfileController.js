/**
 * ProfileController
 * 
 * This controller handles profile-related HTTP requests.
 */
class ProfileController {
    /**
     * Constructor
     * @param {GetUserProfile} getUserProfileUseCase - The get user profile use case
     * @param {UpdateUserProfile} updateUserProfileUseCase - The update user profile use case
     * @param {UpdateProfileImage} updateProfileImageUseCase - The update profile image use case
     */
    constructor(getUserProfileUseCase, updateUserProfileUseCase = null, updateProfileImageUseCase = null) {
        this.getUserProfileUseCase = getUserProfileUseCase;
        this.updateUserProfileUseCase = updateUserProfileUseCase;
        this.updateProfileImageUseCase = updateProfileImageUseCase;
    }

    /**
     * Get the user's profile
     * @param {Object} req - Express request object with userEmail from JWT middleware
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    async getProfile(req, res, next) {
        try {
            const email = req.user.email;

            if (!email) {
                throw new Error('Email not found in token');
            }

            const result = await this.getUserProfileUseCase.execute(email);
            res.status(200).json(result);
        } catch (error) {
            console.error('Profile error:', error);

            const errorResponse = {
                status: error.errorCode || 999, 
                message: error.message || 'An unexpected error occurred',
                data: null
            };

            res.status(error.statusCode || 500).json(errorResponse);
        }
    }

    /**
     * Update the user's profile
     * @param {Object} req - Express request object with userEmail from JWT middleware
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    async updateProfile(req, res, next) {
        try {
            if (!this.updateUserProfileUseCase) {
                throw new Error('Update profile use case not initialized');
            }

            const email = req.user.email;

            if (!email) {
                throw new Error('Email not found in token');
            }

            const userData = req.body;
            const result = await this.updateUserProfileUseCase.execute(email, userData);

            res.status(200).json(result);
        } catch (error) {
            console.error('Update profile error:', error);

            const errorResponse = {
                status: error.errorCode || 999,
                message: error.message || 'An unexpected error occurred',
                data: null
            };

            res.status(error.statusCode || 500).json(errorResponse);
        }
    }

    /**
     * Update the user's profile image
     * @param {Object} req - Express request object with userEmail from JWT middleware and file
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    async updateProfileImage(req, res, next) {
        try {
            if (!this.updateProfileImageUseCase) {
                throw new Error('Update profile image use case not initialized');
            }

            const email = req.user.email;

            if (!email) {
                throw new Error('Email not found in token');
            }

            if (!req.file) {
                return res.status(400).json({
                    status: 102,
                    message: 'Tidak ada file yang diupload',
                    data: null
                });
            }

            const result = await this.updateProfileImageUseCase.execute(email, req.file);

            res.status(200).json(result);
        } catch (error) {
            console.error('Update profile image error:', error);

            const errorResponse = {
                status: error.errorCode || 999,
                message: error.message || 'An unexpected error occurred',
                data: null
            };

            res.status(error.statusCode || 500).json(errorResponse);
        }
    }
}

module.exports = ProfileController;
