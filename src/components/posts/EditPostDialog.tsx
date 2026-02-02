import { useEffect } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Form, FormTextarea } from '@/components/shared/Form';
import { useLoader } from '@/hooks/useLoader';
import { adminService } from '@/services/admin.service';
import type { Post } from '@/types/post';

const schema = z.object({
    content: z.string().min(1, "Content is required")
});

type FormData = z.infer<typeof schema>;

interface EditPostDialogProps {
    post: Post | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export function EditPostDialog({ post, open, onOpenChange, onSuccess }: EditPostDialogProps) {
    const { setLoading } = useLoader();

    const form = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: { content: '' }
    });

    // Reset form when post changes
    useEffect(() => {
        if (post) {
            form.reset({ content: post.content });
        }
    }, [post, form]);

    const submit = async (data: FormData) => {
        if (!post) return;

        try {
            setLoading(true);
            await adminService.updatePost(post.id, { content: data.content });
            toast.success('Post updated');
            onSuccess();
            onOpenChange(false);
        } catch (err: any) {
            toast.error(err.message || 'Failed to update post');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Edit Post</DialogTitle>
                </DialogHeader>
                
                <Form {...form} onSubmit={submit}>
                    <FormTextarea 
                        name="content" 
                        placeholder="Write something..."
                        className="min-h-32"
                    />

                    {post?.image_urls && post.image_urls.length > 0 && (
                        <div className="mt-4">
                            <div className="grid grid-cols-2 gap-2">
                                {post.image_urls.map( ( url ) => (
                                    <img 
                                        key={url}
                                        src={url} 
                                        className="w-full h-24 object-cover rounded-lg border border-zinc-200 dark:border-zinc-800" 
                                        alt="Post image" 
                                    />
                                ))}
                            </div>
                            <p className="text-xs text-zinc-500 mt-2">
                                Images cannot be changed
                            </p>
                        </div>
                    )}

                    <div className="flex justify-end gap-2 mt-4">
                        <Button 
                            type="button" 
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit">Save Changes</Button>
                    </div>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
