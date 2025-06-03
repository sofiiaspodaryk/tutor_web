export const ROLES = {
    ADMIN: 'admin',
    MANAGER: 'manager',
    STUDENT: 'student',
    TUTOR: 'tutor',
};

export const mockUsers = [
    {
        id: 0,
        username: 'admin',
        password: 'admin',
        email: 'admin@example.com',
        role: ROLES.ADMIN,
        createdAt: '2024-01-01T00:00:00.000Z',
    },
    {
        id: 1,
        username: 'manager1',
        password: 'manager123',
        email: 'manager1@example.com',
        role: ROLES.MANAGER,
        createdAt: '2024-01-01T00:00:00.000Z',
    },
    {
        id: 2,
        username: 'student1',
        password: 'student123',
        email: 'student1@example.com',
        role: ROLES.STUDENT,
        createdAt: '2024-01-02T00:00:00.000Z',
    },
    {
        id: 3,
        username: 'tutor1',
        password: 'tutor123',
        email: 'tutor1@example.com',
        role: ROLES.TUTOR,
        createdAt: '2024-01-03T00:00:00.000Z',
    },
];

// Mock API functions
export const fetchUsers = async () => {
    // Simulate API delay
    await new Promise((resolve) => {
        setTimeout(resolve, 300);
    });
    return mockUsers.map(({ password, ...user }) => user); // Don't return passwords
};

export const createUser = async (userData) => {
    await new Promise((resolve) => {
        setTimeout(resolve, 500);
    });

    const newUser = {
        id: Date.now(),
        ...userData,
        createdAt: new Date().toISOString(),
    };

    mockUsers.push(newUser);
    return newUser;
};

export const updateUser = async (id, userData) => {
    await new Promise((resolve) => {
        setTimeout(resolve, 500);
    });

    const userIndex = mockUsers.findIndex((user) => user.id === id);
    if (userIndex === -1) {
        throw new Error('User not found');
    }

    mockUsers[userIndex] = { ...mockUsers[userIndex], ...userData };
    return mockUsers[userIndex];
};

export const deleteUser = async (id) => {
    await new Promise((resolve) => {
        setTimeout(resolve, 500);
    });

    const userIndex = mockUsers.findIndex((user) => user.id === id);
    if (userIndex === -1) {
        throw new Error('User not found');
    }

    const deletedUser = mockUsers.splice(userIndex, 1)[0];
    return deletedUser;
};
