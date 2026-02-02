import { useState, useRef } from 'react';
import { Send, Image as ImageIcon, X } from 'lucide-react';
import { UserAvatar } from '@/components/users/User';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { imageService } from '@/services/image.service';
import { toast } from 'sonner';

interface CommentInputProps {
    placeholder?: string;
    onSubmit: ( content: string, image?: File ) => Promise<void>;
    autoFocus?: boolean;
    className?: string;
    initialContent?: string;
}

export function CommentInput({ 
    placeholder = "Write a comment...", 
    onSubmit, 
    autoFocus, 
    className,
    initialContent = ''
}: CommentInputProps) {
    const { user } = useAuth();
    const [content, setContent] = useState( initialContent );
    const [loading, setLoading] = useState( false );
    const [selectedFile, setSelectedFile] = useState<File | null>( null );
    const [preview, setPreview] = useState<string | null>( null );
    const fileInputRef = useRef<HTMLInputElement>( null );

    const handleFile = ( e: React.ChangeEvent<HTMLInputElement> ) => {
        const file = e.target.files?.[0];
        if ( file ) {
            try {
                imageService.validateImage( file );
                setSelectedFile( file );
                const url = URL.createObjectURL( file );
                setPreview( url );
            } catch ( err: any ) {
                toast.error( err.message );
                if ( fileInputRef.current ) fileInputRef.current.value = '';
            }
        }
    };

    const removeFile = () => {
        if ( preview ) URL.revokeObjectURL( preview );
        setSelectedFile( null );
        setPreview( null );
        if ( fileInputRef.current ) fileInputRef.current.value = '';
    };

    const handleSubmit = async ( e?: React.FormEvent ) => {
        e?.preventDefault();
        if ( ( !content.trim() && !selectedFile ) || loading ) return;

        try {
            setLoading( true );
            await onSubmit( content.trim(), selectedFile || undefined );
            setContent( '' );
            removeFile();
        } finally {
            setLoading( false );
        }
    };

    if ( !user ) return null;

    return (
        <div className={cn( "flex gap-3", className )}>
            <UserAvatar user={user} className="size-8" />
            <div className="flex-1 bg-zinc-100 dark:bg-zinc-800 rounded-2xl px-3 py-2">
                <form onSubmit={handleSubmit} className="flex flex-col">
                    <textarea
                        autoFocus={autoFocus}
                        placeholder={placeholder}
                        className="w-full bg-transparent border-none resize-none text-sm focus:ring-0 p-0 max-h-32 min-h-[20px]"
                        value={content}
                        onChange={( e ) => setContent( e.target.value )}
                        onKeyDown={( e ) => {
                            if ( e.key === 'Enter' && !e.shiftKey ) {
                                e.preventDefault();
                                handleSubmit();
                            }
                        }}
                    />
                    
                    {preview && (
                        <div className="relative mt-2 inline-block group">
                            <img 
                                src={preview} 
                                alt="Preview" 
                                className="max-h-32 rounded-lg object-contain border border-zinc-200 dark:border-zinc-700" 
                            />
                            <button
                                type="button"
                                className="absolute -top-2 -right-2 bg-zinc-900 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={removeFile}
                            >
                                <X className="size-3" />
                            </button>
                        </div>
                    )}

                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-zinc-200/50 dark:border-zinc-700/50">
                        <button
                            type="button"
                            className="p-1.5 text-zinc-500 hover:text-blue-500 hover:bg-white/50 dark:hover:bg-zinc-700/50 rounded-lg transition-colors"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <ImageIcon className="size-4" />
                        </button>
                        
                        <input
                            type="file"
                            className="hidden"
                            ref={fileInputRef}
                            accept="image/png, image/jpeg, image/jpg"
                            onChange={handleFile}
                        />

                        <button
                            type="submit"
                            disabled={( !content.trim() && !selectedFile ) || loading}
                            className="p-1.5 text-blue-500 disabled:text-zinc-400 hover:bg-white/50 dark:hover:bg-zinc-700/50 rounded-lg transition-colors"
                        >
                            <Send className={cn( "size-4", loading && "animate-pulse" )} />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
