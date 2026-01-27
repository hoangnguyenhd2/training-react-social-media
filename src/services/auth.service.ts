import mockUser from '@/mocks/user.json';
import { type User } from '@/types/user';

interface LoginPayload {
    username: string
    password: string
};

export const authService = {
    login: async ( payload: LoginPayload ) : Promise<User> => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (!(mockUser?.username === payload.username && mockUser?.password === payload.password)) {
            throw new Error ('Invaild username or password');
        }
        localStorage.setItem('token', mockUser.access_token);
        return mockUser;
    },
    logout: async () : Promise<void> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        localStorage.removeItem('token');
    },
    me: async () : Promise<User | null> => {
        await new Promise(resolve => setTimeout(resolve, 800));
        return localStorage.getItem('token') ? mockUser : null;
    }
}