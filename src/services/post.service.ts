import mockPosts from '@/mocks/posts.json';
import mockUser from '@/mocks/user.json';
import { type Post } from '@/types/post';

let postMockData: Post[] = [...mockPosts];

export const postService = {
    create: async ( payload: { content: string } ) => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const newPost = {
            id: postMockData.length + 1,
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
    handleDelete: async (id: number) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        postMockData = postMockData.filter(post => post.id !== id);
        return postMockData;
    }
}