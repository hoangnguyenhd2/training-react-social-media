import { useState } from 'react';
import { Link } from "react-router-dom";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';
import { User as IconUser, Home, CalendarCheck2, ListVideo, ShoppingBag, Share2, PackageCheck } from "lucide-react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { SocialPost } from '@/components/Social';
import { UserAvatar } from '@/components/User';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { useApi } from '@/hooks/useApi';

const asideRoutes = [
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
]

const Index = () => {
    const api                             = useApi();
    const { isLogged, user }              = useAuth();
    const [ aside, setAside ]             = useState('Home');
    const [ isCreatePost, setCreatePost ] = useState(false);

    const { isLoading, data: socialPosts } = useQuery({
        queryKey: ['posts'],
        queryFn: () => {
            return api.get('/mocks/posts.json');
        },
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
                    {isLogged && (
                        <div className="flex items-center gap-x-2 shadow p-2 rounded-lg">
                            <UserAvatar className="size-9 border-2 shadow-xl" user={user} />
                            <Input 
                                placeholder="What's happening ?" 
                                className="h-9 bg-transparent text-xl border-none ring-0 shadow-none" 
                                onClick={() => setCreatePost(true)}
                            />
                        </div>
                    )}
                    {socialPosts?.data?.map(post => (
                        <SocialPost key={post?.id} post={post} />
                    ))}
                </div>
                <div className="lg:col-span-3 bg-red-400">x</div>
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
                    hi
                    <DialogFooter className="sm:justify-start">
                        <DialogClose asChild>
                            <Button type="button">Close</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default Index;