import type { User } from './user';

export type ReactionType = 'like' | 'love' | 'haha' | 'wow' | 'sad' | 'angry';

export interface PostCount {
    like: number;
    comment: number;
    share: number;
}

export interface PostActions {
    current: ReactionType | null;
}

export interface Post {
    id: string;
    content: string;
    image_urls?: string[]; // Đã nâng cấp lên multi ảnh
    created_at?: Date | string | { seconds: number; nanoseconds: number }; // Renamed to snake_case
    user_id: string; // Renamed to snake_case
    user: User;
    count: PostCount;
    actions: PostActions;
    score: number;
    likes: string[]; // Danh sách UIDs để đếm nhanh
    reactions: Record<string, ReactionType>; // { userId: 'love' }
}

export interface CreatePostPayload {
    content: string;
    imageFiles?: File[];
}

export interface Comment {
    id: string;
    post_id: string;
    user_id: string;
    user: User;
    content: string;
    image_url?: string;
    parent_id?: string;
    likes: string[]; // array of user_ids
    created_at: Date | string | { seconds: number; nanoseconds: number };
}
