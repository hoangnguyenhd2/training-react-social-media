import { db, auth } from '@/lib/firebase';
import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    query,
    updateDoc,
    increment,
    serverTimestamp,
    getDoc,
    type DocumentData,
    Timestamp,
    arrayUnion,
    arrayRemove,
    deleteField
} from "firebase/firestore";
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import type { Post, CreatePostPayload, ReactionType } from '@/types/post';
// import { authService } from './auth.service'; // Không còn cần authService ở đây nữa
import { imageService } from './image.service';
import { userService } from './user.service';

// Helper: Convert Firestore DocumentData to Post type, including realtime user data
export const mapFirestorePostToPostType = async ( docId: string, docData: DocumentData ): Promise<Post> => {
    const userId = docData.user_id;
    const user = userId ? await userService.getUserData( userId ) : null; // Fetch user data realtime

    return {
        id: docId,
        content: docData.content,
        image_urls: docData.image_urls || ( docData.image_url ? [ docData.image_url ] : ( docData.imageUrl ? [ docData.imageUrl ] : [] ) ),
        created_at: docData.created_at instanceof Timestamp
            ? docData.created_at.toDate()
            : (docData.created_at ? new Date(docData.created_at) : new Date()),
        user_id: docData.user_id,
        user: user || { 
            id: '', 
            name: 'Unknown User', 
            username: 'unknown',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=unknown',
            email: '',
            role: 'user'
        }, // Fallback user
        count: docData.count,
        actions: {
            current: auth.currentUser ? ( docData.reactions?.[auth.currentUser.uid] || null ) : null
        },
        score: docData.score || 0,
        likes: docData.likes || [],
        reactions: docData.reactions || {}
    };
};

export const postService = {
    // Get all posts - Sorted by Score (Trending)
    getAll: async (): Promise<Post[]> => {
        // Bỏ orderBy để tránh lỗi thiếu index Firestore
        const q = query(collection(db, "posts"));
        const snapshot = await getDocs(q);
        const postsPromises = snapshot.docs.map(doc => mapFirestorePostToPostType(doc.id, doc.data()));
        const posts = await Promise.all(postsPromises);

        // Sort ở client: Score desc, then created_at desc
        return posts.sort( ( a, b ) => {
            if ( ( b.score || 0 ) !== ( a.score || 0 ) ) {
                return ( b.score || 0 ) - ( a.score || 0 );
            }
            const dateA = a.created_at instanceof Date ? a.created_at.getTime() : 0;
            const dateB = b.created_at instanceof Date ? b.created_at.getTime() : 0;
            return dateB - dateA;
        });
    },

    // Get single post by ID
    getById: async (id: string): Promise<Post | null> => {
        const docRef = doc(db, "posts", id);
        const snapshot = await getDoc(docRef);
        if (!snapshot.exists()) return null;
        return mapFirestorePostToPostType(snapshot.id, snapshot.data());
    },

    // Create new post
    create: async (payload: CreatePostPayload): Promise<Post> => {
        const currentUser = auth.currentUser;
        if (!currentUser) throw new Error("Not authenticated");

        let image_urls: string[] = [];
 
         // Upload images if provided (Using ImgBB Multi-upload)
         if ( payload.imageFiles && payload.imageFiles.length > 0 ) {
             image_urls = await imageService.uploadMultiple( payload.imageFiles );
         }
 
        const postData = {
             content: payload.content,
             image_urls,
             created_at: serverTimestamp(),
            user_id: currentUser.uid,
            count: { like: 0, comment: 0, share: 0 },
            likes: [],
            reactions: {},
            score: 0
        };

        const docRef = await addDoc(collection(db, "posts"), postData);

        // For immediate UI update, we construct a Post object.
        // The user data will be fresh from getUserData due to user_id.
        const tempPostData = {
            ...postData,
            created_at: new Date() // Use a Date object for immediate display
        };
        // Explicitly cast to DocumentData for mapFirestorePostToPostType
        return mapFirestorePostToPostType(docRef.id, tempPostData as DocumentData);
    },

    // Delete post
    delete: async (id: string): Promise<void> => {
        await deleteDoc(doc(db, "posts", id));
    },

    // Update post (admin or owner)
    update: async (id: string, data: Partial<Post>): Promise<void> => {
        const updatePayload: DocumentData = {};
        if (data.content !== undefined) updatePayload.content = data.content;
        if (data.image_urls !== undefined) updatePayload.image_urls = data.image_urls;
        // Note: For partial updates, it's safer to specify which fields can be updated
        // For example, if you only allow content to be updated:
        // if (data.content !== undefined) updatePayload.content = data.content;

        await updateDoc(doc(db, "posts", id), updatePayload);
    },

    // React to post (any emotion)
    react: async ( postId: string, type: ReactionType | null, isNew: boolean ): Promise<void> => {
        const currentUser = auth.currentUser;
        if ( !currentUser ) throw new Error( "Not authenticated" );

        const postRef = doc( db, "posts", postId );
        const isUnlike = type === null;

        const updateData: any = {
            [`reactions.${currentUser.uid}`]: isUnlike ? deleteField() : type
        };

        if ( isUnlike ) {
            updateData["count.like"] = increment( -1 );
            updateData["score"]      = increment( -1 );
            updateData["likes"]      = arrayRemove( currentUser.uid );
        } else if ( isNew ) {
            updateData["count.like"] = increment( 1 );
            updateData["score"]      = increment( 1 );
            updateData["likes"]      = arrayUnion( currentUser.uid );
        }

        await updateDoc( postRef, updateData );
    }
};

// Aliases for backward compatibility
export const handleDelete = postService.delete;
export const handleReact = postService.react;