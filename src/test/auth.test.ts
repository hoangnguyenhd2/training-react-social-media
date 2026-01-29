import { it, expect, describe, beforeEach } from "vitest";
import { authService } from "@/services/auth.service";
import mockUser from '@/mocks/user.json';

describe('Test auth service', () => {
    beforeEach(() => {
        localStorage.clear();
    });
    it('should login successfully', async () => {
        const user = await authService.login({
            username: 'hoangnguyenhd2',
            password: 'hoangnguyenhd2'
        });
        expect(user).toHaveProperty('id');
        expect(localStorage.getItem('token')).toBe(user.access_token);
    });
    it('should login failed', async () => {
        await expect(authService.login({
            username: 'wrongusername',
            password: 'wrongpassword'
        })).rejects.toThrow('Invaild username or password');
        expect(localStorage.getItem('token')).toBe(null);
    });
    it('should get me successfully', async () => {
        localStorage.setItem('token', 'jwt-token');
        const user = await authService.me();
        expect(user).toStrictEqual(mockUser);
    });
    it('should get me wrong token', async () => {
        localStorage.setItem('token', 'wrong-token');
        const user = await authService.me();
        expect(user).toBe(null);
    });
    it('should logout successfully', async () => {
        localStorage.setItem('token', 'jwt-token');
        await authService.logout();
        expect(localStorage.getItem('token')).toBe(null);
    });
});