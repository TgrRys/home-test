/**
 * GetUser use case
 * 
 * This class implements the business logic for retrieving a user.
 */
class GetUser {
    /**
     * Constructor
     * @param {UserRepository} userRepository - An implementation of UserRepository
     */
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Execute the use case to get a user by ID
     * @param {string|number} id - The user ID
     * @returns {Promise<User>} The user
     * @throws {Error} If the user cannot be found
     */
    async execute(id) {
        const user = await this.userRepository.findById(id);

        if (!user) {
            throw new Error('User not found');
        }

        return user;
    }
}

module.exports = GetUser;
