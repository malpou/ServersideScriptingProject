import UserRepository from "../../src/data/user.repository";

// Mock the prisma client
const mockPrisma = {
    users: {
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        findMany: jest.fn(),
        findFirst: jest.fn(),
    },
};

jest.mock('@prisma/client', () => {
    return {
        PrismaClient: jest.fn(() => mockPrisma),
        Prisma: {
            UsersCreateInput: jest.fn(),
        },
        Users: jest.fn(),
    };
});

// Test suite for UserRepository class
describe('UserRepository', () => {
    let userRepository: UserRepository;

    // Before each test, clear all mocks and create a new UserRepository instance
    beforeEach(() => {
        jest.clearAllMocks();
        userRepository = new UserRepository();
    });

    // Test that createUser correctly interacts with the PrismaClient and returns the correct data
    it('should create a new user', async () => {
        const userData = {
            id: 1,
            username: 'Test user',
            email: 'test@example.com',
            profile_picture: 'base64imageString',
        };

        mockPrisma.users.create.mockResolvedValue(userData);

        const result = await userRepository.createUser(userData);
        expect(mockPrisma.users.create).toHaveBeenCalledWith({data: userData});
        expect(result).toEqual(userData);
    });

    // Test that getUserById correctly interacts with the PrismaClient and returns the correct data
    it('should retrieve a user by their ID', async () => {
        const testUser = {
            id: 1,
            username: 'Test user',
            email: 'test@example.com',
            profile_picture: 'base64imageString',
        };

        mockPrisma.users.findUnique.mockResolvedValue(testUser);

        const result = await userRepository.getUserById(testUser.id);
        expect(mockPrisma.users.findUnique).toHaveBeenCalledWith({
            where: {id: testUser.id},
        });
        expect(result).toEqual(testUser);
    });

    // Test that updateUser correctly interacts with the PrismaClient and returns the correct data
    it('should update a user with the given data', async () => {
        const testUser = {
            id: 1,
            username: 'Test user',
            email: 'test@example.com',
            profile_picture: 'base64imageString',
        };

        const updatedData = {
            username: 'Updated user',
            email: 'updated@example.com',
        };

        mockPrisma.users.update.mockResolvedValue({
            ...testUser,
            ...updatedData,
        });

        const result = await userRepository.updateUser(testUser.id, updatedData);
        expect(mockPrisma.users.update).toHaveBeenCalledWith({
            where: {id: testUser.id},
            data: updatedData,
        });
        expect(result).toEqual({
            ...testUser,
            ...updatedData,
        });
    });

    // Test that deleteUser correctly interacts with the PrismaClient and returns the correct data
    it('should delete a user by their ID', async () => {
        const testUser = {
            id: 1,
            username: 'Test user',
            email: 'test@example.com',
            profile_picture: 'base64imageString',
        };

        mockPrisma.users.delete.mockResolvedValue(testUser);

        const result = await userRepository.deleteUser(testUser.id);

        expect(mockPrisma.users.delete).toHaveBeenCalledWith({
            where: {id: testUser.id},
        });

        expect(result).toEqual(testUser);
    });

    // Test that getAllUsers correctly interacts with the PrismaClient and returns the correct data
    it('should retrieve all users', async () => {
        const testUsers = [
            {
                id: 1,
                username: 'Test user 1',
                email: 'test1@example.com',
                profile_picture: 'base64imageString1',
            },
            {
                id: 2,
                username: 'Test user 2',
                email: 'test2@example.com',
                profile_picture: 'base64imageString2',
            },
        ];

        mockPrisma.users.findMany.mockResolvedValue(testUsers);

        const result = await userRepository.getAllUsers();

        expect(mockPrisma.users.findMany).toHaveBeenCalled();

        expect(result).toEqual(testUsers);
    });

    // Test that getNextId correctly interacts with the PrismaClient and returns the correct data
    it('should retrieve the next available user ID', async () => {
        const lastUser = {
            id: 2,
            username: 'Test user 2',
            email: 'test2@example.com',
            profile_picture: 'base64imageString2',
        };

        mockPrisma.users.findFirst.mockResolvedValue(lastUser);

        const result = await userRepository.getNextId();

        expect(mockPrisma.users.findFirst).toHaveBeenCalledWith({
            orderBy: {
                id: 'desc',
            },
        });

        expect(result).toEqual(lastUser.id + 1);
    });
});

