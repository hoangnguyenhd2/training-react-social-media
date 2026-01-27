import { useState } from 'react';
import { ROUTES } from '@/constants/routes';
import { Link } from "react-router-dom";
import { Button } from '@/components/ui/button';
import { Ellipsis, ThumbsUp, MessageCircle, ExternalLink } from "lucide-react";
import { UserAvatar } from '@/components/User';
import { 
    DropdownMenu, 
    DropdownMenuTrigger, 
    DropdownMenuContent, 
    DropdownMenuItem
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export function SocialPost ({ post }) {
    const { isLogged }            = useAuth();
    const [ isLiked, setIsLiked ] = useState(false);
    return (
        <div className="shadow rounded-lg">
            <div className="border-b p-3 flex items-start justify-between border border-b-slate-500/15">
                <div className="flex items-ceter gap-x-2">
                    <UserAvatar 
                        className="size-10" 
                        user={post.user} 
                    />
                    <div className="flex justify-center flex-col gap-0.5">
                        <Link to={ROUTES.INDEX}>
                            <h5 className="font-semibold text-sm">{post.user.name}</h5>
                        </Link>
                        <Link to={ROUTES.INDEX} className="text-slate-500 text-xs hover:underline">1m ago</Link>
                    </div>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost">
                            <Ellipsis />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent 
                        sideOffset={10}
                        align="end"
                    >
                        <DropdownMenuItem>Logout</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="p-3">
                {post.content}
            </div>
            <div className="p-1.5 grid grid-cols-3 gap-1.5 border border-t-slate-500/15 [&_div]:rounded-lg">
                <div 
                    className={cn(
                        'flex items-center justify-center gap-x-1 py-2.5 text-sm cursor-pointer hover:bg-slate-500/10',
                        {'bg-blue-500/10 text-blue-500': isLiked}
                    )}
                    onClick={() => {
                        if (!isLogged) {
                            return toast.error('Please login');
                        }
                        setIsLiked(!isLiked);
                    }}
                >
                    <ThumbsUp className="size-4" /><b>{post.count.like + isLiked}</b><span>Like</span>
                </div>
                <div className="flex items-center justify-center gap-x-1 py-2.5 text-sm hover:bg-slate-500/10">
                    <MessageCircle className="size-4" /><b>{post.count.comment}</b><span>Comment</span>
                </div>
                <div className="flex items-center justify-center gap-x-1 py-2.5 text-sm cursor-pointer hover:bg-slate-500/10">
                    <ExternalLink className="size-4" /><span>Share</span>
                </div>
            </div>
        </div>
    )
}