/**
 * UpdateProfileImage use case
 * 
 * This class implements the business logic for updating a user's profile image.
 */
class UpdateProfileImage {
    /**
     * Constructor
     * @param {UserRepository} userRepository - An implementation of UserRepository
     */
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Execute the use case
     * @param {string} email - The email of the user to update
     * @param {Object} fileData - The uploaded file data
     * @param {string} fileData.mimetype - The MIME type of the uploaded file
     * @param {string} fileData.buffer - The file buffer
     * @param {string} fileData.originalname - The original file name
     * @returns {Promise<Object>} The result object with updated user profile data
     * @throws {Error} If user is not found or file format is invalid
     */
    async execute(email, fileData) {
        try {
            if (!this.isValidImageFormat(fileData.mimetype)) {
                const error = new Error('Format Image tidak sesuai');
                error.statusCode = 400;
                error.errorCode = 102;
                throw error;
            }

            const user = await this.userRepository.findByEmail(email);

            if (!user) {
                const error = new Error('User tidak ditemukan');
                error.statusCode = 404;
                error.errorCode = 109; 
                throw error;
            }

            const imageUrl = `https://yoururlapi.com/${Date.now()}-${fileData.originalname}`;

            const updateData = {
                profile_image: imageUrl
            };

            await this.userRepository.update(user.id, updateData);

            return {
                status: 0,
                message: "Update Profile Image berhasil",
                data: {
                    email: user.email,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    profile_image: imageUrl
                }
            };
        } catch (error) {
            if (!error.statusCode) {
                error.statusCode = 500;
                error.errorCode = 999;
            }
            throw error;
        }
    }

    /**
     * Check if the image format is valid (jpeg or png)
     * @param {string} mimetype - The MIME type of the file
     * @returns {boolean} Whether the format is valid
     */
    isValidImageFormat(mimetype) {
        const allowedFormats = ['image/jpeg', 'image/png'];
        return allowedFormats.includes(mimetype);
    }
}

module.exports = UpdateProfileImage;
