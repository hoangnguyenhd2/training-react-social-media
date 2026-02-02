import { auth, db } from '@/lib/firebase';
import {
    signInWithEmailAndPassword,
    signOut,
    createUserWithEmailAndPassword,
    updateProfile,
    type User as FirebaseUser
} from "firebase/auth";
import { doc, getDoc, setDoc, query, where, collection, getDocs, limit, Timestamp } from "firebase/firestore"; // Đã thêm Timestamp
import type { User } from '@/types/user';

interface LoginPayload {
    email: string;
    password: string;
}

interface RegisterPayload extends LoginPayload {
    name: string;
    username: string;
}

// Custom error messages for Firebase Auth
const firebaseErrorMessages: { [key: string]: string } = {
    'auth/email-already-in-use': 'Email này đã được sử dụng. Vui lòng sử dụng email khác.',
    'auth/invalid-email': 'Địa chỉ email không hợp lệ.',
    'auth/user-not-found': 'Tài khoản không tồn tại.',
    'auth/wrong-password': 'Mật khẩu không đúng.',
    'auth/weak-password': 'Mật khẩu quá yếu. Vui lòng dùng mật khẩu mạnh hơn (ít nhất 6 ký tự).',
    'auth/network-request-failed': 'Lỗi mạng. Vui lòng kiểm tra kết nối internet của bạn.',
    'auth/too-many-requests': 'Tài khoản bị khóa tạm thời do nhiều lần đăng nhập không thành công. Vui lòng thử lại sau.',
    // Thêm các lỗi khác nếu cần
    'default': 'Đã xảy ra lỗi không xác định. Vui lòng thử lại.'
};

// Helper function to handle Firebase errors
const handleFirebaseError = (error: any, defaultMessage: string = firebaseErrorMessages['default']): string => {
    if (error && error.code && firebaseErrorMessages[error.code]) {
        return firebaseErrorMessages[error.code];
    }
    return error.message || defaultMessage;
};

// Helper: Convert Firebase user to app User
async function toAppUser(firebaseUser: FirebaseUser): Promise<User> {
    const token = await firebaseUser.getIdToken();
    localStorage.setItem('token', token);

    const userDocRef = doc(db, "users", firebaseUser.uid);
    const userDoc = await getDoc(userDocRef);
    const userData = userDoc.data();

    return {
        id: firebaseUser.uid,
        username: userData?.username || firebaseUser.email?.split('@')[0] || '',
        email: firebaseUser.email || '',
        name: userData?.name || firebaseUser.displayName || 'Anonymous',
        avatar: userData?.avatar || firebaseUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData?.username || firebaseUser.email?.split('@')[0]}`,
        role: userData?.role || 'user',
        access_token: token,
        created_at: userData?.created_at instanceof Timestamp ? userData.created_at.toDate() : (userData?.created_at ? new Date(userData.created_at) : undefined),
        updated_at: userData?.updated_at instanceof Timestamp ? userData.updated_at.toDate() : (userData?.updated_at ? new Date(userData.updated_at) : undefined)
    };
}

export const authService = {
    // Login with email/password
    login: async (payload: LoginPayload): Promise<User> => {
        try {
            const { user } = await signInWithEmailAndPassword(auth, payload.email, payload.password);
            return toAppUser(user);
        } catch (error) {
            throw new Error(handleFirebaseError(error, 'Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu.'));
        }
    },

    // Register new user
    register: async (payload: RegisterPayload): Promise<User> => {
        try {
            // Check if username exists
            const q = query(
                collection(db, "users"),
                where("username", "==", payload.username),
                limit(1)
            );
            const snapshot = await getDocs(q);

            if (!snapshot.empty) {
                throw new Error("Tên người dùng đã được sử dụng. Vui lòng chọn tên khác.");
            }

            // Create Firebase Auth account
            const { user: firebaseUser } = await createUserWithEmailAndPassword(
                auth,
                payload.email,
                payload.password
            );

            // Update display name
            await updateProfile(firebaseUser, { displayName: payload.name });

            // Prepare user data
            const userData = {
                username: payload.username,
                email: firebaseUser.email || payload.email, // Use firebaseUser.email in case of updates
                name: payload.name,
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${payload.username}`,
                role: 'admin' as const,
                created_at: new Date() // Store as Date object
            };

            // Save to Firestore
            await setDoc(doc(db, "users", firebaseUser.uid), userData);

            // Get token and return user
            const token = await firebaseUser.getIdToken();
            localStorage.setItem('token', token);

            return {
                id: firebaseUser.uid,
                ...userData,
                access_token: token
            };
        } catch (error) {
            if (error instanceof Error && error.message === "Tên người dùng đã được sử dụng. Vui lòng chọn tên khác.") {
                throw error; // Re-throw custom username error
            }
            throw new Error(handleFirebaseError(error, 'Đăng ký thất bại. Vui lòng thử lại.'));
        }
    },

    // Logout
    logout: async (): Promise<void> => {
        await signOut(auth);
        localStorage.removeItem('token');
    },

    // Get current user
    me: async (): Promise<User | null> => {
        const firebaseUser = auth.currentUser;
        if (!firebaseUser) {
            localStorage.removeItem('token');
            return null;
        }
        return toAppUser(firebaseUser);
    }
};
