import { it, expect, describe, beforeEach, vi } from "vitest";
import type { Post } from '@/types/post';

// Inline mock data
const mockPost = {
    id: 'mock-post-123',
    content: 'This is a mock post for testing',
    image_urls: [],
    user_id: 'mock-user-123',
    user: {
        id: 'mock-user-123',
        username: 'testuser',
        email: 'test@example.com',
        name: 'Test User',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=testuser',
        role: 'user'
    },
    count: { like: 5, comment: 2, share: 1 },
    actions: { current: null },
    score: 0,
    likes: [],
    reactions: {}
} satisfies Post;

/**
 * Post Service Unit Tests
 * These tests mock Firebase to test service logic without network calls.
 */

// Mock Firebase modules
vi.mock('firebase/firestore', () => ({
    collection: vi.fn(),
    addDoc: vi.fn(),
    getDocs: vi.fn(),
    deleteDoc: vi.fn(),
    doc: vi.fn(),
    query: vi.fn(),
    orderBy: vi.fn(),
    updateDoc: vi.fn(),
    increment: vi.fn((n) => n),
    serverTimestamp: vi.fn(() => new Date()),
    getDoc: vi.fn(() => Promise.resolve({
        exists: () => true,
        id: 'mock-user-123',
        data: () => ({
            username: 'testuser',
            email: 'test@example.com',
            name: 'Test User',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=testuser',
            role: 'user'
        })
    })),
    initializeFirestore: vi.fn(),
    arrayUnion: vi.fn((...args) => args),
    arrayRemove: vi.fn((...args) => args),
    deleteField: vi.fn(() => 'deleted'),
    Timestamp: class {
        static now() { return new Date(); }
        toDate() { return new Date(); }
    }
}));

vi.mock('firebase/storage', () => ({
    ref: vi.fn(),
    uploadBytes: vi.fn(),
    getDownloadURL: vi.fn(),
    getStorage: vi.fn()
}));

vi.mock('firebase/auth', () => ({
    getAuth: vi.fn(() => ({
        currentUser: {
            uid: 'test-uid',
            displayName: 'Test User',
            photoURL: ''
        }
    }))
}));

vi.mock('@/lib/firebase', () => ({
    auth: {
        currentUser: {
            uid: 'test-uid',
            displayName: 'Test User',
            photoURL: ''
        }
    },
    db: {},
    storage: {}
}));

describe('Post Service Unit Tests', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('mock post should have correct structure', () => {
        const post = mockPost as Post;
        
        expect(post).toHaveProperty('id');
        expect(post).toHaveProperty('content');
        expect(post).toHaveProperty('user_id');
        expect(post).toHaveProperty('user');
        expect(post).toHaveProperty('count');
        expect(post).toHaveProperty('actions');
        
        expect(post.user).toHaveProperty('id');
        expect(post.user).toHaveProperty('name');
        expect(post.user).toHaveProperty('avatar');
        
        expect(post.count).toHaveProperty('like');
        expect(post.count).toHaveProperty('comment');
        expect(post.count).toHaveProperty('share');
    });

    it('getAll should return array of posts', async () => {
        const { getDocs, query } = await import('firebase/firestore');
        
        vi.mocked(getDocs).mockResolvedValue({
            docs: [
                { id: '1', data: () => ({ ...mockPost, id: undefined }) },
                { id: '2', data: () => ({ ...mockPost, id: undefined, content: 'Second post' }) }
            ]
        } as any);
        
        const { postService } = await import('@/services/post.service');
        const posts = await postService.getAll();
        
        expect(Array.isArray(posts)).toBe(true);
        expect(posts.length).toBe(2);
        expect(query).toHaveBeenCalled();
    });

    it('getById should return single post', async () => {
        const { getDoc, doc } = await import('firebase/firestore');
        
        const mockSnapshot = {
            exists: () => true,
            id: 'test-id',
            data: () => ({ ...mockPost, id: undefined })
        };
        vi.mocked(getDoc).mockResolvedValue(mockSnapshot as any);
        
        // Re-import to get fresh instance with updated mocks
        vi.resetModules();
        const { postService } = await import('@/services/post.service');
        const post = await postService.getById('test-id');
        
        expect(post).not.toBeNull();
        expect(post?.content).toBe(mockPost.content);
        expect(doc).toHaveBeenCalled();
    });

    it('getById should return null for non-existent post', async () => {
        const { getDoc } = await import('firebase/firestore');
        
        vi.mocked(getDoc).mockResolvedValue({
            exists: () => false
        } as any);
        
        const { postService } = await import('@/services/post.service');
        const post = await postService.getById('non-existent');
        
        expect(post).toBeNull();
    });

    it('delete should call deleteDoc', async () => {
        const { deleteDoc, doc } = await import('firebase/firestore');
        
        vi.mocked(deleteDoc).mockResolvedValue();
        
        const { postService } = await import('@/services/post.service');
        await postService.delete('post-id');
        
        expect(deleteDoc).toHaveBeenCalled();
        expect(doc).toHaveBeenCalled();
    });

    it('react should update like count', async () => {
        const { updateDoc, increment } = await import('firebase/firestore');
        
        vi.mocked(updateDoc).mockResolvedValue();
        
        const { postService } = await import('@/services/post.service');
        await postService.react('post-id', 'like', true);
        
        expect(updateDoc).toHaveBeenCalled();
        expect(increment).toHaveBeenCalledWith(1);
    });

    it('react unlike should decrement like count', async () => {
        const { increment, updateDoc } = await import('firebase/firestore');
        vi.mocked(updateDoc).mockResolvedValue();
        
        const { postService } = await import('@/services/post.service');
        await postService.react('post-id', null, false);
        
        expect(increment).toHaveBeenCalledWith(-1);
    });
});
