import { db } from '@/lib/firebase';
import { doc, getDoc } from "firebase/firestore";
import type { User } from '@/types/user';

// Cache user data for a short period to avoid excessive reads
const userCache = new Map<string, User>();
const CACHE_LIFETIME = 5 * 60 * 1000; // 5 minutes

export const userService = {
    getUserData: async ( userId: string ): Promise<User | null> => {
        if ( userCache.has( userId ) ) {
            const cachedUser = userCache.get( userId )!;
            const cachedAt = ( cachedUser as any )._cachedAt || 0;
            
            // Check if cache is still valid
            if ( Date.now() - cachedAt < CACHE_LIFETIME ) {
                return cachedUser;
            } else {
                userCache.delete( userId ); // Expire cache
            }
        }

        const userDocRef = doc( db, "users", userId );
        const userDocSnap = await getDoc( userDocRef );

        if ( userDocSnap.exists() ) {
            const userData = {
                id: userDocSnap.id,
                ...userDocSnap.data(),
                _cachedAt: Date.now()
            } as unknown as User;
            userCache.set( userId, userData );
            return userData;
        }

        return null;
    }
};
