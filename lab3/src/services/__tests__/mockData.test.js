import {
    mockUsers, ROLES, fetchUsers, createUser,
    updateUser, deleteUser, findUserById, findUserByUsername
} from '../mockData';

// Mock the setTimeout function
jest.useFakeTimers();

describe('mockData Service', () => {
    const originalMockUsers = [...mockUsers];
    
    // Restore the original mockUsers array after each test
    afterEach(() => {
        // Reset mockUsers to original state
        mockUsers.length = 0;
        originalMockUsers.forEach(user => mockUsers.push({ ...user }));
    });

    it('should have predefined roles', () => {
        expect(ROLES).toEqual({
            ADMIN: 'admin',
            MANAGER: 'manager',
            STUDENT: 'student',
            TUTOR: 'tutor',
        });
    });

    it('should have initial mock users', () => {
        expect(mockUsers.length).toBeGreaterThan(0);
        expect(mockUsers[0].username).toBe('admin');
        expect(mockUsers[0].role).toBe(ROLES.ADMIN);
    });
    
    describe('fetchUsers', () => {
        it('should return users without passwords', async () => {
            const promise = fetchUsers();
            
            // Fast-forward through the timeout
            jest.runAllTimers();
            
            const users = await promise;
            expect(users.length).toEqual(mockUsers.length);
            
            // Verify passwords are not included
            users.forEach(user => {
                expect(user.password).toBeUndefined();
                expect(mockUsers.some(mockUser => mockUser.id === user.id)).toBeTruthy();
            });
        });
    });
    
    describe('createUser', () => {
        it('should create a new user', async () => {
            const newUser = {
                username: 'newuser',
                email: 'newuser@example.com',
                password: 'password123',
                role: ROLES.STUDENT
            };
            
            const originalLength = mockUsers.length;
            const promise = createUser(newUser);
            
            // Fast-forward through the timeout
            jest.runAllTimers();
            
            const createdUser = await promise;
            
            // Check if user was correctly added to mockUsers
            expect(mockUsers.length).toEqual(originalLength + 1);
            expect(createdUser.username).toEqual(newUser.username);
            expect(createdUser.email).toEqual(newUser.email);
            expect(createdUser.id).toBeDefined();
            expect(createdUser.createdAt).toBeDefined();
            
            // Clean up the test data
            mockUsers.pop();
        });
    });
    
    describe('updateUser', () => {
        it('should update an existing user', async () => {
            const userId = 2;
            const updatedData = {
                username: 'updatedstudent',
                email: 'updated@example.com',
                role: ROLES.STUDENT
            };
            
            const promise = updateUser(userId, updatedData);
            
            // Fast-forward through the timeout
            jest.runAllTimers();
            
            const updatedUser = await promise;
            
            expect(updatedUser.id).toEqual(userId);
            expect(updatedUser.username).toEqual(updatedData.username);
            expect(updatedUser.email).toEqual(updatedData.email);
            
            // Verify the user was actually updated in the array
            const userInArray = mockUsers.find(u => u.id === userId);
            expect(userInArray.username).toEqual(updatedData.username);
            expect(userInArray.email).toEqual(updatedData.email);
            
            // Reset the test data
            mockUsers[mockUsers.findIndex(u => u.id === userId)] = {
                id: userId,
                username: 'student1',
                password: 'student123',
                email: 'student1@example.com',
                role: ROLES.STUDENT,
                createdAt: '2024-01-02T00:00:00.000Z',
            };
        });
        
        it('should throw error when updating non-existent user', async () => {
            const nonExistentId = 999;
            const updatedData = {
                username: 'nonexistent',
                email: 'nonexistent@example.com',
            };
            
            await expect(updateUser(nonExistentId, updatedData)).rejects.toThrow('User not found');
        });
    });
    
    describe('deleteUser', () => {
        it('should delete a user', async () => {
            const originalLength = mockUsers.length;
            
            // Add a test user to delete
            const testUser = {
                id: 999,
                username: 'testdelete',
                password: 'testpass',
                email: 'testdelete@example.com',
                role: ROLES.STUDENT,
                createdAt: '2024-01-05T00:00:00.000Z',
            };
            
            mockUsers.push(testUser);
            
            const promise = deleteUser(testUser.id);
            
            // Fast-forward through the timeout
            jest.runAllTimers();
            
            await promise;
            
            // Verify user was deleted
            expect(mockUsers.length).toEqual(originalLength);
            expect(mockUsers.find(u => u.id === testUser.id)).toBeUndefined();
        });
        
        it('should throw error when deleting non-existent user', async () => {
            const nonExistentId = 999;
            
            await expect(deleteUser(nonExistentId)).rejects.toThrow('User not found');
        });
    });
    
    describe('fetchTutors', () => {
        it('should return only tutors', async () => {
            const promise = fetchTutors();
            
            // Fast-forward through the timeout
            jest.runAllTimers();
            
            const tutors = await promise;
            
            // Ensure all returned users have tutor role
            tutors.forEach(tutor => {
                expect(tutor.role).toEqual(ROLES.TUTOR);
            });
            
            // Ensure all tutors from mockUsers are included
            const tutorsFromMock = mockUsers.filter(u => u.role === ROLES.TUTOR);
            expect(tutors.length).toEqual(tutorsFromMock.length);
        });
    });
    
    describe('fetchTutor', () => {
        it('should return a specific tutor', async () => {
            const tutorId = 3; // ID of tutor1 from the mock data
            
            const promise = fetchTutor(tutorId);
            
            // Fast-forward through the timeout
            jest.runAllTimers();
            
            const tutor = await promise;
            
            expect(tutor.id).toEqual(tutorId);
            expect(tutor.role).toEqual(ROLES.TUTOR);
            expect(tutor.password).toBeUndefined(); // Password should not be included
        });
        
        it('should throw error when fetching non-existent tutor', async () => {
            const nonExistentId = 999;
            
            await expect(fetchTutor(nonExistentId)).rejects.toThrow('Tutor not found');
        });
        
        it('should throw error when fetching a user with a different role than tutor', async () => {
            const nonTutorId = 2; // ID of student1 from the mock data
            
            await expect(fetchTutor(nonTutorId)).rejects.toThrow('User is not a tutor');
        });
    });
});
