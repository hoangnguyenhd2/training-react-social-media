import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Image as ImageIcon, X } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { SocialPost } from '@/components/posts/Social';
import { UserAvatar } from '@/components/users/User';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { useLoader } from '@/hooks/useLoader';
import { postService } from '@/services/post.service';
import { imageService } from '@/services/image.service';
import { Form, FormTextarea } from '@/components/shared/Form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const postSchema = z.object({
    content: z.string()
});

type PostForm = z.infer<typeof postSchema>;

const Index = () => {
    const { setLoading } = useLoader();
    const { isLogged, user } = useAuth();
    const [showCreatePost, setShowCreatePost] = useState(false);

    const { data: posts = [], refetch } = useQuery({
        queryKey: ['posts'],
        queryFn: postService.getAll
    });

    const handleDelete = async (postId: string) => {
        if (!confirm('Delete this post?')) return;
        try {
            setLoading(true);
            await postService.delete(postId);
            toast.success('Post deleted');
            refetch();
        } catch (err: any) {
            toast.error(err.message || 'Error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto space-y-4">
            {isLogged && user && (
                <div 
                    className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 sm:p-4 rounded-xl cursor-pointer hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
                    onClick={() => setShowCreatePost(true)}
                >
                    <div className="flex items-center gap-3">
                        <UserAvatar className="size-9 sm:size-10" user={user} />
                        <div className="flex-1 bg-zinc-100 dark:bg-zinc-800 rounded-full px-4 py-2.5 text-sm text-zinc-500">
                            What's on your mind?
                        </div>
                    </div>
                </div>
            )}

            {posts.length > 0 ? (
                posts.map(post => (
                    <SocialPost 
                        key={post.id} 
                        post={post} 
                        onDelete={() => handleDelete(post.id)}
                        onUpdate={refetch}
                    />
                ))
            ) : (
                <div className="text-center py-16 text-zinc-400">
                    No posts yet. Be the first to post!
                </div>
            )}

            <CreatePostDialog 
                open={showCreatePost} 
                onOpenChange={setShowCreatePost} 
                onSuccess={refetch}
            />
        </div>
    );
}

function CreatePostDialog({ open, onOpenChange, onSuccess }: { 
    open: boolean;
    onOpenChange: (v: boolean) => void;
    onSuccess: () => void;
}) {
    const { setLoading } = useLoader();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previews, setPreviews] = useState<string[]>([]);
    const [files, setFiles] = useState<File[]>([]);

    const form = useForm<PostForm>({
        resolver: zodResolver(postSchema),
        defaultValues: { content: '' }
    });

    const handleFile = ( e: React.ChangeEvent<HTMLInputElement> ) => {
        const selectedFiles = Array.from( e.target.files || [] );
        try {
            selectedFiles.forEach( f => imageService.validateImage( f ) );
            if ( selectedFiles.length > 0 ) {
                setFiles( prev => [ ...prev, ...selectedFiles ] );
                const newPreviews = selectedFiles.map( f => URL.createObjectURL( f ) );
                setPreviews( prev => [ ...prev, ...newPreviews ] );
            }
        } catch ( err: any ) {
            toast.error( err.message );
            if ( fileInputRef.current ) fileInputRef.current.value = '';
        }
    };

    const removeFile = ( index: number ) => {
        const newFiles = [ ...files ];
        const newPreviews = [ ...previews ];
        
        URL.revokeObjectURL( previews[index] );
        newFiles.splice( index, 1 );
        newPreviews.splice( index, 1 );
        
        setFiles( newFiles );
        setPreviews( newPreviews );
    };

    const clearFiles = () => {
        files.forEach( ( _, i ) => URL.revokeObjectURL( previews[i] ) );
        setFiles( [] );
        setPreviews( [] );
        if ( fileInputRef.current ) fileInputRef.current.value = '';
    };

    const submit = async ( data: PostForm ) => {
        const content = data.content?.trim();
        
        if ( !content && files.length === 0 ) {
            toast.error( 'Please provide some content or select an image.' );
            return;
        }

        try {
            setLoading( true );
            await postService.create({
                content: content || '',
                imageFiles: files.length > 0 ? files : undefined
            });
            toast.success( 'Posted!' );
            onSuccess();
            onOpenChange( false );
            clearFiles();
            form.reset();
        } catch ( err: any ) {
            toast.error( err.message || 'Error' );
        } finally {
            setLoading( false );
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create Post</DialogTitle>
                </DialogHeader>
                
                <Form {...form} onSubmit={submit}>
                    <FormTextarea 
                        name="content" 
                        placeholder="What's on your mind?"
                        className="min-h-24 border-0 focus-visible:ring-0 resize-none text-base"
                    />

                    {previews.length > 0 && (
                        <div className={cn(
                            "grid gap-2 mb-4",
                            previews.length === 1 ? "grid-cols-1" : "grid-cols-2"
                        )}>
                            {previews.map( ( url, index ) => (
                                <div key={url} className="relative aspect-video group">
                                    <img 
                                        src={url} 
                                        className="w-full h-full object-cover rounded-lg border border-zinc-200 dark:border-zinc-800" 
                                        alt="" 
                                    />
                                    <button 
                                        type="button"
                                        className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => removeFile( index )}
                                    >
                                        <X className="size-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
                        <input 
                            type="file" 
                            accept="image/png, image/jpeg, image/jpg" 
                            multiple 
                            className="hidden" 
                            ref={fileInputRef} 
                            onChange={handleFile} 
                        />
                        <Button type="button" variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()}>
                            <ImageIcon className="size-5 text-green-500" />
                        </Button>
                        <Button type="submit" disabled={!form.formState.isValid}>Post</Button>
                    </div>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

export default Index;
