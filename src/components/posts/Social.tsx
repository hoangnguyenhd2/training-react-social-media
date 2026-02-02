import { useState, useRef, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Heart, Share2, Trash2, Edit, BarChart3, MessageCircle } from "lucide-react";
import { UserAvatar } from '@/components/users/User';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { useLongPress } from '@/hooks/useLongPress';
import { toast } from 'sonner';
import type { Post, ReactionType } from '@/types/post';
import { postService } from '@/services/post.service';
import { timeAgo, buildRoute } from '@/utils/global';
import { ROUTES } from '@/constants/routes';
import { EditPostDialog } from './EditPostDialog';
import { ImageLightbox } from '@/components/shared/ImageLightbox';
import { CommentSection } from './CommentSection';
import { ShareDialog } from './ShareDialog';
import { ReactionPicker, ReactionDisplay, getReaction, REACTIONS } from './ReactionPicker';

interface SocialPostProps {
    post: Post;
    onDelete: () => void;
    onUpdate?: () => void;
}

export function SocialPost({ post, onDelete, onUpdate }: SocialPostProps) {
    const navigate = useNavigate();
    const { isLogged, user } = useAuth();
    const [reaction, setReaction] = useState<ReactionType | null>(post.actions?.current || null);
    const [reactionCount, setReactionCount] = useState(post.count.like);
    const [showReactions, setShowReactions] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState( false );
    const [showComments, setShowComments] = useState( false );
    const [commentCount, setCommentCount] = useState( post.count.comment );
    const [lightbox, setLightbox] = useState({ open: false, index: 0 });
    const [showShareDialog, setShowShareDialog] = useState( false );
    const hoverTimerRef = useRef<any>( null );

    const isOwner = isLogged && user?.id === post.user.id;
    const isAdmin = isLogged && user?.role === 'admin';
    const canManage = isOwner || isAdmin;

    const handleReaction = async (type: ReactionType) => {
        if (!isLogged) {
            toast.error('Please sign in to react');
            return;
        }

        const wasReacted = reaction !== null;
        const isSameReaction = reaction === type;

        // Hide ReactionPicker after selection
        setShowReactions(false);

        if (isSameReaction) {
            setReaction(null);
            setReactionCount(prev => prev - 1);
            try {
                await postService.react(post.id, null, false);
            } catch {
                setReaction(type);
                setReactionCount(prev => prev + 1);
                toast.error('Something went wrong');
            }
        } else {
            setReaction(type);
            if (!wasReacted) setReactionCount(prev => prev + 1);
            try {
                await postService.react(post.id, type, !wasReacted);
            } catch {
                setReaction(wasReacted ? reaction : null);
                if (!wasReacted) setReactionCount(prev => prev - 1);
                toast.error('Something went wrong');
            }
        }
    };

    const handleQuickReact = () => {
        handleReaction(reaction || 'like');
    };

    // Delay 1s (1000ms) cho longpress
    const longPressHandlers = useLongPress({
        onLongPress: () => {
            setShowReactions(true);
            // Clear hover timer if long press triggers while hover timer is running
            if (hoverTimerRef.current) {
                clearTimeout(hoverTimerRef.current);
                hoverTimerRef.current = null;
            }
        },
        onClick: handleQuickReact,
        delay: 1000 // 1 giây
    });

    const handleMouseEnterReactionArea = useCallback(() => {
        // Chỉ hiện picker sau 1 giây nếu chuột vẫn ở trong khu vực
        hoverTimerRef.current = setTimeout(() => {
            setShowReactions(true);
        }, 1000); // 1 giây
    }, []);

    const handleMouseLeaveReactionArea = useCallback(() => {
        // Xóa timer và ẩn picker ngay lập tức khi rời khu vực
        if (hoverTimerRef.current) {
            clearTimeout(hoverTimerRef.current);
            hoverTimerRef.current = null;
        }
        setShowReactions(false);
    }, []);

    const handleViewAnalytics = () => {
        navigate(buildRoute(ROUTES.POST_ANALYTICS, { id: post.id }));
    };

    const handleShare = () => {
        setShowShareDialog( true );
    };

    const currentReaction = getReaction(reaction);

    return (
        <>
            <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
                {/* Header */}
                <div className="p-3 sm:p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <UserAvatar className="size-9 sm:size-10" user={post.user} />
                        <div>
                            <p className="font-semibold text-sm sm:text-[15px]">{post.user.name}</p>
                            <Link to={buildRoute(ROUTES.POST_DETAIL, { id: post.id })} className="text-xs text-zinc-500 hover:underline">
                                {timeAgo(post.created_at)}
                            </Link>
                        </div>
                    </div>

                    {canManage && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="size-8 sm:size-9 rounded-full">
                                    <MoreHorizontal className="size-5" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem onClick={handleViewAnalytics}>
                                    <BarChart3 className="size-4 mr-2" />
                                    Analytics
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                                    <Edit className="size-4 mr-2" />
                                    Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-500 focus:text-red-500" onClick={onDelete}>
                                    <Trash2 className="size-4 mr-2" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>

                {/* Content */}
                <div className="px-3 sm:px-4 pb-3">
                    <p className="text-sm sm:text-[15px] whitespace-pre-line leading-relaxed">{post.content}</p>
                </div>

                {/* Images */}
                {post.image_urls && post.image_urls.length > 0 && (
                    <div className={cn(
                        "grid gap-px border-y border-zinc-100 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800",
                        post.image_urls.length === 1 ? "grid-cols-1" : "grid-cols-2"
                    )}>
                        {post.image_urls.map( ( url, index ) => (
                            <img
                                key={url}
                                src={url}
                                alt=""
                                className={cn(
                                    "w-full object-cover cursor-pointer hover:brightness-95 transition-all",
                                    post.image_urls!.length === 1 ? "max-h-[500px]" : "aspect-square"
                                )}
                                onClick={() => setLightbox({ open: true, index })}
                            />
                        ))}
                    </div>
                )}

                {/* Stats */}
                {reactionCount > 0 && (
                    <div className="px-3 sm:px-4 py-2 flex items-center text-sm text-zinc-500">
                        <div className="flex -space-x-1 mr-2">
                            {REACTIONS.slice(0, 3).map(r => (
                                <span key={r.type} className="size-5 rounded-full bg-white dark:bg-zinc-800 flex items-center justify-center text-xs border border-zinc-200 dark:border-zinc-700">
                                    {r.emoji}
                                </span>
                            ))}
                        </div>
                        <span>{reactionCount}</span>
                        {commentCount > 0 && (
                            <span className="ml-auto hover:underline cursor-pointer" onClick={() => setShowComments( !showComments )}>
                                {commentCount} comments
                            </span>
                        )}
                    </div>
                )}

                {/* Actions */}
                <div className="px-2 py-1 border-t border-zinc-100 dark:border-zinc-800">
                    <div className="grid grid-cols-3 gap-1">
                        <div
                            className="relative"
                            onMouseEnter={handleMouseEnterReactionArea}
                            onMouseLeave={handleMouseLeaveReactionArea}
                        >
                            <ReactionPicker
                                visible={showReactions}
                                onSelect={handleReaction}
                                onClose={() => setShowReactions(false)}
                            />
                            <button
                                {...longPressHandlers}
                                className={cn(
                                    "flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium text-sm w-full select-none transition-colors",
                                    reaction
                                        ? currentReaction?.color
                                        : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                )}
                            >
                                {reaction ? (
                                    <ReactionDisplay reaction={reaction} />
                                ) : (
                                    <>
                                        <Heart className="size-5" />
                                        <span className="hidden sm:inline">Like</span>
                                    </>
                                )}
                            </button>
                        </div>
                        <button
                            onClick={() => setShowComments( !showComments )}
                            className={cn(
                                "flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium text-sm w-full select-none transition-colors",
                                showComments 
                                    ? "text-blue-500 bg-blue-50 dark:bg-blue-900/20" 
                                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                            )}
                        >
                            <MessageCircle className="size-5" />
                            <span className="hidden sm:inline">Comment</span>
                        </button>
                        <button
                            onClick={handleShare}
                            className="flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                        >
                            <Share2 className="size-5" />
                            <span className="hidden sm:inline">Share</span>
                        </button>
                    </div>
                </div>

                {showComments && (
                    <CommentSection 
                        postId={post.id} 
                        onCommentAdded={() => setCommentCount( prev => prev + 1 )}
                        onCommentDeleted={() => setCommentCount( prev => prev - 1 )}
                    />
                )}
            </div>

            <EditPostDialog
                post={post}
                open={showEditDialog}
                onOpenChange={setShowEditDialog}
                onSuccess={() => onUpdate?.()}
            />

            <ImageLightbox
                images={post.image_urls || []}
                initialIndex={lightbox.index}
                open={lightbox.open}
                onOpenChange={( open ) => setLightbox( ( prev ) => ({ ...prev, open }) )}
            />

            <ShareDialog
                open={showShareDialog}
                onOpenChange={setShowShareDialog}
                url={`${window.location.origin}/post/${post.id}`}
                title={post.content}
            />
        </>
    );
}