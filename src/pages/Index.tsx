import { useState, useMemo } from 'react';
import { Link } from "react-router-dom";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ROUTES } from '@/constants/routes';
import { User as IconUser, Home, CalendarCheck2, ListVideo, ShoppingBag, Share2, PackageCheck } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { SocialPost } from '@/components/Social';
import { UserAvatar } from '@/components/User';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { useLoader } from '@/hooks/useLoader';
import { postService } from '@/services/post.service';
import { Form, FormTextarea } from '@/components/Form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const createPostFormSchema = z.object({
    content: z.string().min(5)
});

type createPostFormType = z.infer<typeof createPostFormSchema>;

const Index = () => {
    const { setLoading }                  = useLoader();
    const { isLogged, user }              = useAuth();
    const [ aside, setAside ]             = useState('Home');
    const [ isCreatePost, setCreatePost ] = useState(false);

    const asideRoutes = useMemo(() => [
        {
            text: 'Home',
            icon: <Home className="size-5 transition-scale duration-300 group-hover:scale-115 text-black-500" />
        },
        {
            text: 'Friends',
            icon: <IconUser className="size-5 transition-scale duration-300 group-hover:scale-115 text-blue-500" />
        },
        {
            text: 'Memories',
            icon: <PackageCheck className="size-5 transition-scale duration-300 group-hover:scale-115 text-yellow-500" />
        },
        {
            text: 'Saved',
            icon: <CalendarCheck2 className="size-5 transition-scale duration-300 group-hover:scale-115 text-green-500" />
        },
        {
            text: 'Group',
            icon: <Share2 className="size-5 transition-scale duration-300 group-hover:scale-115 text-orange-500" />
        },
        {
            text: 'Reels',
            icon: <ListVideo className="size-5 transition-scale duration-300 group-hover:scale-115 text-red-500" />
        },
        {
            text: 'Marketplace',
            icon: <ShoppingBag className="size-5 transition-scale duration-300 group-hover:scale-115 text-pink-500" />
        }
    ], []);

    const form = useForm<createPostFormType>({
        resolver: zodResolver(createPostFormSchema),
        defaultValues: {
            content: ''
        }
    });
    const submit = async ( data: createPostFormType ) => {
        try {
            setLoading(true);
            await postService.create(data);
            toast.success('Create post successfully');
        } catch ( err: any ) {
            toast.error(err.message || 'Unknow error');
        } finally {
            setLoading(false);
            setCreatePost(false);
            refetch();
            form.reset();
        }
    }

    const { data: socialPosts, refetch } = useQuery({
        queryKey: ['posts'],
        queryFn: postService.getAll,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: false
    });

    return (
        <>
            <div className="grid lg:grid-cols-12 gap-4">
                <div className="lg:col-span-2">
                    <ul className="grid max-lg:grid-cols-3 gap-2">
                        {/* dark:bg-white dark:[&_.lucide]:text-red-600 */}
                        {asideRoutes.map(row => (
                            <li key={row.text}>
                                <Link 
                                    to={ROUTES.INDEX} 
                                    className={cn(
                                        'group text-sm hover:bg-muted/10 [&.active]:bg-muted/10 flex items-center gap-x-2.5 py-2.5 px-3.5 rounded-lg transition-background duration-400',
                                        {'active': aside === row.text}
                                    )}
                                    onClick={e => {
                                        e.preventDefault();
                                        setAside(row.text);
                                    }}
                                >
                                    <div className="size-5.5">
                                        {row.icon}
                                    </div>
                                    <span className="text-slate-700 group-hover:text-black group-hover:font-bold group-has-[.active]:text-black group-has-[.active]:font-bold">{row.text}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="lg:col-span-7 space-y-4">
                    {isLogged && user && (
                        <div className="flex items-center gap-x-2 shadow p-2 rounded-lg">
                            <UserAvatar 
                                className="size-9 border-2 shadow-xl" 
                                user={user} 
                            />
                            <Input 
                                placeholder="What's happening ?" 
                                className="h-9 bg-transparent text-xl border-none ring-0 shadow-none" 
                                onClick={() => setCreatePost(true)}
                            />
                        </div>
                    )}
                    {socialPosts?.map(post => (
                        <SocialPost 
                            key={post?.id} 
                            post={post} 
                            onDelete={async () => {
                                try {
                                    setLoading(true);
                                    if (confirm('Are you sure you want to delete this post?')) {
                                        await postService.handleDelete(Number(post.id));
                                        toast.success('Delete post successfully');
                                        refetch();
                                    }
                                } catch (err: any) {
                                    toast.error(err.message || 'Unknow error');
                                } finally {
                                    setLoading(false);
                                }
                            }}
                        />
                    ))}
                </div>
            </div>
            <Dialog
                open={isCreatePost}
                onOpenChange={setCreatePost}
            >
                <DialogContent className="sm:max-w-xl">
                    <DialogHeader>
                        <DialogTitle>Create a post</DialogTitle>
                        <DialogDescription>
                            Got something to say? Write a post and let others know what’s on your mind.
                        </DialogDescription>
                    </DialogHeader>
                    <Form 
                        {...form} 
                        onSubmit={submit}
                    >
                        <FormTextarea 
                            name="content" 
                            placeholder="What's happening ?"
                        />
                        <Button className="w-full">Create</Button>
                    </Form>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default Index;