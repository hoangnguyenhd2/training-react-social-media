import mockPosts from '@/mocks/posts.json';
import mockUser from '@/mocks/user.json';
import mockAnalytics from '@/mocks/analytics.json';
import { type Post } from '@/types/post';

let postMockData: Post[] = mockPosts.map(post => ({
    ...post,
    id: String(post.id),
    user: {
        ...mockUser
    }
}));

export const postService = {
    create: async ( payload: { content: string } ) => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const newPost: Post = {
            id: String(postMockData.length + 1),
            ...payload,
            count: {
                like: 0,
                comment: 0,
                share: 0
            },
            actions: {
                liked: false
            },
            user: mockUser
        }
        postMockData = [newPost, ...postMockData];
        return postMockData;
    },
    getAll: async () => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return postMockData;
    },
    getAnalytics: async (postId: string | number) : Promise<any[]> => {
        await new Promise(resolve => setTimeout(resolve, 300));
        return mockAnalytics.filter((item: any) => item.postId === Number(postId));
    },
    handleDelete: async (id: number) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        postMockData = postMockData.filter(post => post.id !== String(id));
        return postMockData;
    }
}