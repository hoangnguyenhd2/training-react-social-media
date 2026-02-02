import { db } from '@/lib/firebase';
import {
    collection,
    getDocs,
    doc,
    deleteDoc,
    updateDoc,
    query,
    orderBy,
    getCountFromServer,
    where,
    Timestamp
} from "firebase/firestore";
import type { User } from '@/types/user';
import type { Post } from '@/types/post';
import { mapFirestorePostToPostType, postService as PostService } from './post.service'; // Import mapFirestorePostToPostType và postService

export interface DashboardStats {
    totalUsers: number;
    totalPosts: number;
    todayPosts: number;
    totalLikes: number;
}

export const adminService = {
    // Dashboard stats
    getStats: async (): Promise<DashboardStats> => {
        const usersSnap = await getCountFromServer(collection(db, "users"));
        const postsSnap = await getCountFromServer(collection(db, "posts"));
        
        // Today's posts
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayQuery = query(
            collection(db, "posts"),
            where("created_at", ">=", Timestamp.fromDate(today))
        );
        const todaySnap = await getCountFromServer(todayQuery);
        
        // Total likes
        const allPosts = await getDocs(collection(db, "posts"));
        let totalLikes = 0;
        allPosts.forEach(doc => {
            totalLikes += doc.data().count?.like || 0;
        });

        return {
            totalUsers: usersSnap.data().count,
            totalPosts: postsSnap.data().count,
            todayPosts: todaySnap.data().count,
            totalLikes
        };
    },

    // Users
    getUsers: async (): Promise<User[]> => {
        const q = query(collection(db, "users"), orderBy("created_at", "desc"));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as User[];
    },

    updateUser: async (id: string, data: Partial<User>): Promise<void> => {
        await updateDoc(doc(db, "users", id), data);
    },

    deleteUser: async (id: string): Promise<void> => {
        await deleteDoc(doc(db, "users", id));
    },

    // Posts
    getPosts: async (): Promise<Post[]> => {
        const q = query(collection(db, "posts"), orderBy("created_at", "desc"));
        const snapshot = await getDocs(q);
        const postsPromises = snapshot.docs.map(doc => mapFirestorePostToPostType(doc.id, doc.data()));
        return Promise.all(postsPromises);
    },

    updatePost: async (id: string, data: Partial<Post>): Promise<void> => {
        await PostService.update(id, data); // Tái sử dụng postService
    },

    deletePost: async (id: string): Promise<void> => {
        await PostService.delete(id); // Tái sử dụng postService
    }
};
