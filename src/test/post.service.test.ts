import { it, expect, describe, beforeEach } from "vitest";
import { postService } from "@/services/post.service";
import mockUser from '@/mocks/user.json';

describe('Test post service', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('should create post successfully', async () => {
        const resultBefore = await postService.getAll();
        const lengthBefore = resultBefore.length;
        const result = await postService.create({ content: 'Test post content' });
        expect(result).toHaveLength(lengthBefore + 1);
        expect(result[0]).toHaveProperty('content', 'Test post content');
        expect(result[0]).toHaveProperty('user');
        expect(result[0].count).toEqual({ like: 0, comment: 0, share: 0 });
    });

    it('should get all posts', async () => {
        const result = await postService.getAll();
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBeGreaterThan(0);
        expect(result[0]).toHaveProperty('id');
        expect(result[0]).toHaveProperty('content');
    });

    it('should get analytics for a post', async () => {
        const result = await postService.getAnalytics(1);
        expect(Array.isArray(result)).toBe(true);
    });

    it('should delete post successfully', async () => {
        const allPostsBefore = await postService.getAll();
        const postIdToDelete = parseInt(allPostsBefore[0].id);
        
        await postService.handleDelete(postIdToDelete);
        const allPostsAfter = await postService.getAll();
        
        const deletedPost = allPostsAfter.find(p => p.id === String(postIdToDelete));
        expect(deletedPost).toBeUndefined();
    });

    it('should maintain post data structure on create', async () => {
        const result = await postService.create({ content: 'Test content' });
        const newPost = result[0];
        
        expect(newPost).toHaveProperty('id');
        expect(newPost).toHaveProperty('content');
        expect(newPost).toHaveProperty('user');
        expect(newPost).toHaveProperty('count');
        expect(newPost).toHaveProperty('actions');
        expect(newPost.user).toStrictEqual(mockUser);
    });
})
