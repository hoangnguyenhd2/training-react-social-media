import { db, auth } from '@/lib/firebase';
import {
    collection,
    addDoc,
    getDocs,
    doc,
    query,
    where,
    serverTimestamp,
    updateDoc,
    increment,
    deleteDoc,
    arrayUnion,
    arrayRemove
} from "firebase/firestore";
import type { Comment } from '@/types/post';
import { userService } from './user.service';
import { imageService } from './image.service';

export const commentService = {
    // Get all root comments for a post
    getByPostId: async ( post_id: string ): Promise<Comment[]> => {
        const q = query(
            collection( db, "comments" ),
            where( "post_id", "==", post_id ),
            where( "parent_id", "==", null )
        );

        const snapshot = await getDocs( q );
        const commentsPromises = snapshot.docs.map( async ( doc ) => {
            const data = doc.data();
            const user = await userService.getUserData( data.user_id );
            
            return {
                id: doc.id,
                post_id: data.post_id,
                user_id: data.user_id,
                content: data.content,
                image_url: data.image_url,
                parent_id: data.parent_id,
                likes: data.likes || [],
                created_at: data.created_at?.toDate() || new Date(),
                user: user || { 
                    id: '', 
                    name: 'Unknown User', 
                    username: 'unknown',
                    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=unknown',
                    email: '',
                    role: 'user'
                }
            } as Comment;
        });

        const comments = await Promise.all( commentsPromises );
        return comments.sort( ( a, b ) => {
            const dateA = a.created_at instanceof Date ? a.created_at.getTime() : 0;
            const dateB = b.created_at instanceof Date ? b.created_at.getTime() : 0;
            return dateA - dateB;
        });
    },

    // Get replies for a comment
    getReplies: async ( parent_id: string ): Promise<Comment[]> => {
        const q = query(
            collection( db, "comments" ),
            where( "parent_id", "==", parent_id )
            // orderBy( "created_at", "asc" ) // Bỏ để tránh lỗi missing index
        );
        const snapshot = await getDocs( q );
        const commentsPromises = snapshot.docs.map( async ( doc ) => {
            const data = doc.data();
            const user = await userService.getUserData( data.user_id );
            
            return {
                id: doc.id,
                post_id: data.post_id,
                user_id: data.user_id,
                content: data.content,
                image_url: data.image_url,
                parent_id: data.parent_id,
                likes: data.likes || [],
                created_at: data.created_at?.toDate() || new Date(),
                user: user || { 
                    id: '', 
                    name: 'Unknown User', 
                    username: 'unknown',
                    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=unknown',
                    email: '',
                    role: 'user'
                }
            } as Comment;
        });

        const results = await Promise.all( commentsPromises );
        return results.sort( ( a, b ) => {
            const dateA = a.created_at instanceof Date ? a.created_at.getTime() : 0;
            const dateB = b.created_at instanceof Date ? b.created_at.getTime() : 0;
            return dateA - dateB;
        });
    },

    // Add a comment
    add: async ( post_id: string, content: string, parent_id: string | null = null, imageFile?: File ): Promise<void> => {
        const currentUser = auth.currentUser;
        if ( !currentUser ) throw new Error( "Authentication required" );

        let image_url = '';
        if ( imageFile ) {
            image_url = await imageService.uploadImage( imageFile );
        }

        await addDoc( collection( db, "comments" ), {
            post_id,
            user_id: currentUser.uid,
            content,
            image_url,
            parent_id,
            likes: [],
            created_at: serverTimestamp()
        });

        // Increment comment count & score (+3) on post
        const postRef = doc( db, "posts", post_id );
        await updateDoc( postRef, {
            "count.comment": increment( 1 ),
            "score": increment( 3 )
        });
    },

    // Update a comment
    update: async ( comment_id: string, content: string ): Promise<void> => {
        const commentRef = doc( db, "comments", comment_id );
        await updateDoc( commentRef, { content });
    },

    // Delete a comment
    delete: async ( comment_id: string, post_id: string ): Promise<void> => {
        const commentRef = doc( db, "comments", comment_id );
        await deleteDoc( commentRef );

        // Decrement comment count & score (-3) on post
        const postRef = doc( db, "posts", post_id );
        await updateDoc( postRef, {
            "count.comment": increment( -1 ),
            "score": increment( -3 )
        });
    },

    // Toggle Like
    toggleLike: async ( comment_id: string, userId: string, isLiked: boolean ): Promise<void> => {
        const commentRef = doc( db, "comments", comment_id );
        await updateDoc( commentRef, {
            likes: isLiked ? arrayRemove( userId ) : arrayUnion( userId )
        });
    }
};
