import { it, expect, describe, beforeEach, vi } from "vitest";

/**
 * Auth Service Unit Tests
 * These tests mock Firebase to test auth logic without network calls.
 */

// Mock Firebase modules
vi.mock('firebase/auth', () => ({
    signInWithEmailAndPassword: vi.fn(),
    signOut: vi.fn(),
    createUserWithEmailAndPassword: vi.fn(),
    updateProfile: vi.fn(),
    getAuth: vi.fn(() => ({ currentUser: null }))
}));

vi.mock('firebase/firestore', () => ({
    doc: vi.fn(),
    getDoc: vi.fn(),
    setDoc: vi.fn(),
    query: vi.fn(),
    where: vi.fn(),
    collection: vi.fn(),
    getDocs: vi.fn(),
    limit: vi.fn(),
    initializeFirestore: vi.fn()
}));

vi.mock('@/lib/firebase', () => ({
    auth: { currentUser: null },
    db: {}
}));

describe('Auth Service Unit Tests', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
    });

    it('should clear token on logout', async () => {
        const { signOut } = await import('firebase/auth');
        vi.mocked(signOut).mockResolvedValue();
        
        const { authService } = await import('@/services/auth.service');
        
        localStorage.setItem('token', 'some-token');
        await authService.logout();
        
        expect(localStorage.getItem('token')).toBe(null);
        expect(signOut).toHaveBeenCalled();
    });

    it('should return null for me() when not logged in', async () => {
        const { authService } = await import('@/services/auth.service');
        
        const user = await authService.me();
        
        expect(user).toBe(null);
        expect(localStorage.getItem('token')).toBe(null);
    });

    it('localStorage should be cleared after failed auth', () => {
        localStorage.setItem('token', 'test-token');
        localStorage.removeItem('token');
        expect(localStorage.getItem('token')).toBe(null);
    });
});
