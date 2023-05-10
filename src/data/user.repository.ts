import {PrismaClient, Users, Prisma} from '@prisma/client';

/**
 * UserRepository class for performing CRUD operations on the Users model.
 */
class UserRepository {
    private prisma: PrismaClient;

    /**
     * Initializes a new instance of the UserRepository class.
     */
    constructor() {
        this.prisma = new PrismaClient();
    }

    /**
     * Creates a new user with the given data.
     * @param {Prisma.UsersCreateInput} userData - The data to create a new user.
     * @returns {Promise<Users>} A promise that resolves to the created user.
     */
    async createUser(userData: Prisma.UsersCreateInput): Promise<Users> {
        return this.prisma.users.create({
            data: userData,
        });
    }

    /**
     * Retrieves a user by their ID.
     * @param {number} id - The ID of the user to retrieve.
     * @returns {Promise<Users | null>} A promise that resolves to the user if found, or null if not found.
     */
    async getUserById(id: number): Promise<Users | null> {
        return this.prisma.users.findUnique({
            where: {id},
        });
    }

    /**
     * Updates a user with the given data.
     * @param {number} id - The ID of the user to update.
     * @param {Partial<Users>} userData - The data to update the user with.
     * @returns {Promise<Users>} A promise that resolves to the updated user.
     */
    async updateUser(id: number, userData: Partial<Users>): Promise<Users> {
        return this.prisma.users.update({
            where: {id},
            data: userData,
        });
    }

    /**
     * Deletes a user by their ID.
     * @param {number} id - The ID of the user to delete.
     * @returns {Promise<Users>} A promise that resolves to the deleted user.
     */
    async deleteUser(id: number): Promise<Users> {
        return this.prisma.users.delete({
            where: {id},
        });
    }

    /**
     * Retrieves all users.
     * @returns {Promise<Users[]>} A promise that resolves to an array of all users.
     */
    async getAllUsers(): Promise<Users[]> {
        return this.prisma.users.findMany();
    }

    /**
     * Retrieves the next available user ID.
     * @returns {Promise<number>} A promise that resolves to the next available user ID.
     */
    async getNextId(): Promise<number> {
        const lastUser = await this.prisma.users.findFirst({
            orderBy: {
                id: 'desc',
            },
        });

        return lastUser ? lastUser.id + 1 : 1;
    }
}

export default UserRepository;
