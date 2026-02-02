import { db, auth } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

/**
 * Image Service
 * Handles uploading images to ImgBB and logging to Firestore
 */

const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;
const IMGBB_UPLOAD_URL = "https://api.imgbb.com/1/upload";
const ALLOWED_TYPES = [ 'image/jpeg', 'image/png', 'image/jpg' ];

export interface ImgBBResponse {
    data: {
        id: string;
        title: string;
        url_viewer: string;
        url: string;
        display_url: string;
        width: string;
        height: string;
        size: string;
        time: string;
        expiration: string;
        image: {
            filename: string;
            name: string;
            mime: string;
            extension: string;
            url: string;
        };
        thumb: {
            filename: string;
            name: string;
            mime: string;
            extension: string;
            url: string;
        };
        delete_url: string;
    };
    success: boolean;
    status: number;
}

export const imageService = {
    /**
     * Validate image file
     * @param file The file to validate
     */
    validateImage: ( file: File ) => {
        if ( !ALLOWED_TYPES.includes( file.type ) ) {
            throw new Error( `Invalid file format for ${file.name}. Only JPG and PNG are accepted.` );
        }
    },

    /**
     * Upload a single image to ImgBB and log to Firestore
     * @param file The image file to upload
     * @param expiration Expiration time in seconds (optional)
     * @returns The URL of the uploaded image
     */
    uploadImage: async ( file: File, expiration?: number ) => {
        if ( !file ) return '';

        // Validate first
        imageService.validateImage( file );

        const formData = new FormData();
        formData.append( 'image', file );

        let url = `${IMGBB_UPLOAD_URL}?key=${IMGBB_API_KEY}`;
        if ( expiration ) {
            url += `&expiration=${expiration}`;
        }

        try {
            const response = await fetch( url, {
                method: 'POST',
                body: formData
            });

            if ( !response.ok ) {
                const errorData = await response.json();
                throw new Error( errorData.error?.message || 'Lỗi khi upload ảnh lên ImgBB' );
            }

            const result: ImgBBResponse = await response.json();
            const imageUrl              = result.data.url;

            // Log to Firestore 'uploads' collection
            const currentUser = auth.currentUser;
            await addDoc( collection( db, "uploads" ), {
                url: imageUrl,
                name: file.name,
                size: file.size,
                type: file.type,
                user_id: currentUser?.uid || 'anonymous',
                provider: 'imgbb',
                created_at: serverTimestamp()
            });

            return imageUrl;
        } catch ( error ) {
            console.error( 'ImgBB Upload Error:', error );
            throw error;
        }
    },

    /**
     * Upload multiple images
     * @param files Array of files to upload
     * @returns Array of uploaded image URLs
     */
    uploadMultiple: async ( files: File[] ) => {
        if ( !files || files.length === 0 ) return [];
        
        // Map each file to an upload promise
        const uploadPromises = files.map( file => imageService.uploadImage( file ) );
        return Promise.all( uploadPromises );
    }
};
