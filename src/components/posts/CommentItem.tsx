import { useState, useEffect } from 'react';
import { Heart, Reply, MoreHorizontal, Trash2, Edit2 } from 'lucide-react';
import { UserAvatar } from '@/components/users/User';
import { commentService } from '@/services/comment.service';
import { useAuth } from '@/hooks/useAuth';
import { timeAgo } from '@/utils/global';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { CommentInput } from './CommentInput';
import type { Comment } from '@/types/post';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ImageLightbox } from '@/components/shared/ImageLightbox';

interface CommentItemProps {
    comment: Comment;
    depth?: number;
    onDeleted?: () => void;
    onUpdated?: () => void;
}

export function CommentItem({ comment, depth = 0, onDeleted, onUpdated }: CommentItemProps) {
    const { user } = useAuth();
    const [isLiked, setIsLiked] = useState( user ? comment.likes.includes( user.id ) : false );
    const [likesCount, setLikesCount] = useState( comment.likes.length );
    const [showReplyInput, setShowReplyInput] = useState( false );
    const [isEditing, setIsEditing] = useState( false );
    const [replies, setReplies] = useState<Comment[]>( [] );
    const [showReplies, setShowReplies] = useState( false );
    const [showLightbox, setShowLightbox] = useState( false );
    const isOwner = user?.id === comment.user_id;

    const handleLike = async () => {
        if ( !user ) {
            toast.error( 'Please login to like' );
            return;
        }
        try {
            const newLiked = !isLiked;
            setIsLiked( newLiked );
            setLikesCount( prev => newLiked ? prev + 1 : prev - 1 );
            await commentService.toggleLike( comment.id, user.id, isLiked );
        } catch ( err ) {
            // Rollback on error
            setIsLiked( isLiked );
            setLikesCount( comment.likes.length );
        }
    };

    const handleDelete = async () => {
        if ( !confirm( 'Are you sure you want to delete this comment?' ) ) return;
        try {
            await commentService.delete( comment.id, comment.post_id );
            toast.success( 'Comment deleted' );
            onDeleted?.();
        } catch ( err: any ) {
            toast.error( err.message || 'Failed to delete' );
        }
    };

    const handleUpdate = async ( content: string ) => {
        try {
            await commentService.update( comment.id, content );
            setIsEditing( false );
            onUpdated?.();
            toast.success( 'Comment updated' );
        } catch ( err: any ) {
            toast.error( err.message || 'Failed to update' );
        }
    };

    const handleAddReply = async ( content: string, imageFile?: File ) => {
        try {
            await commentService.add( comment.post_id, content, comment.id, imageFile );
            setShowReplyInput( false );
            setShowReplies( true );
            fetchReplies();
            toast.success( 'Reply added' );
        } catch ( err: any ) {
            toast.error( err.message || 'Failed to add reply' );
        }
    };

    const fetchReplies = async () => {
        try {
            const data = await commentService.getReplies( comment.id );
            setReplies( data );
        } catch ( err ) {
            console.error( 'Failed to fetch replies:', err );
        }
    };

    useEffect( () => {
        if ( depth === 0 && showReplies ) {
            fetchReplies();
        }
    }, [comment.id, showReplies]);

    return (
        <div className="group">
            <div className="flex gap-3">
                <UserAvatar user={comment.user} className={cn( "shrink-0", depth > 0 ? "size-6" : "size-8" )} />
                <div className="flex-1 min-w-0">
                    {isEditing ? (
                        <CommentInput 
                            initialContent={comment.content}
                            onSubmit={handleUpdate}
                            autoFocus
                            className="mt-1"
                        />
                    ) : (
                        <div className="space-y-1">
                            <div className="inline-block bg-zinc-100 dark:bg-zinc-800 rounded-2xl px-3 py-2 text-sm relative">
                                <div className="font-bold text-xs mb-0.5">{comment.user.name}</div>
                                <div className="text-zinc-800 dark:text-zinc-200 break-words whitespace-pre-wrap">{comment.content}</div>
                                
                                {likesCount > 0 && (
                                    <div className="absolute -right-2 -bottom-2 bg-white dark:bg-zinc-700 shadow-sm border border-zinc-100 dark:border-zinc-600 rounded-full px-1.5 py-0.5 flex items-center gap-1 text-[10px] text-zinc-500">
                                        <Heart className="size-3 fill-red-500 text-red-500" />
                                        {likesCount}
                                    </div>
                                )}
                            </div>

                            {comment.image_url && (
                                <div className="mt-2">
                                    <img 
                                        src={comment.image_url} 
                                        alt="Comment" 
                                        className="max-h-48 rounded-lg border border-zinc-200 dark:border-zinc-700 object-contain cursor-pointer hover:brightness-95 transition-all"
                                        onClick={() => setShowLightbox( true )}
                                    />
                                </div>
                            )}

                            <div className="flex items-center gap-4 text-xs font-semibold text-zinc-500 mt-1 ml-2">
                                <span>{timeAgo( comment.created_at )}</span>
                                <button 
                                    onClick={handleLike}
                                    className={cn( "hover:underline", isLiked && "text-red-500" )}
                                >
                                    Like
                                </button>
                                {depth === 0 && (
                                    <button 
                                        onClick={() => setShowReplyInput( !showReplyInput )}
                                        className="hover:underline"
                                    >
                                        Reply
                                    </button>
                                )}
                                
                                {isOwner && (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full">
                                                <MoreHorizontal className="size-3" />
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="start" className="w-32">
                                            <DropdownMenuItem onClick={() => setIsEditing( true )}>
                                                <Edit2 className="mr-2 size-3" /> Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={handleDelete} className="text-red-500 focus:text-red-500 font-medium">
                                                <Trash2 className="mr-2 size-3" /> Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                )}
                            </div>
                        </div>
                    )}

                    {showReplyInput && (
                        <CommentInput 
                            placeholder={`Replying to ${comment.user.name}...`}
                            onSubmit={handleAddReply}
                            autoFocus
                            className="mt-3"
                        />
                    )}

                    {/* Replies */}
                    {depth === 0 && (
                        <div className="mt-2 space-y-4">
                            {!showReplies && !comment.parent_id && (
                                // This assumes we track reply_count loosely or fetch them
                                // For now, simple "Show replies" toggle
                                <button 
                                    onClick={() => setShowReplies( true )}
                                    className="text-xs font-semibold text-zinc-500 hover:underline flex items-center gap-2 ml-2"
                                >
                                    <Reply className="size-3 rotate-180" />
                                    Show replies
                                </button>
                            )}

                            {showReplies && (
                                <div className="pl-4 border-l-2 border-zinc-100 dark:border-zinc-800 space-y-4">
                                    {replies.map( reply => (
                                        <CommentItem 
                                            key={reply.id} 
                                            comment={reply} 
                                            depth={1} 
                                            onDeleted={fetchReplies}
                                            onUpdated={fetchReplies}
                                        />
                                    ))}
                                    {replies.length > 0 && (
                                        <button 
                                            onClick={() => setShowReplies( false )}
                                            className="text-xs font-semibold text-zinc-500 hover:underline ml-2"
                                        >
                                            Hide replies
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
            {comment.image_url && (
                <ImageLightbox
                    images={[comment.image_url]}
                    initialIndex={0}
                    open={showLightbox}
                    onOpenChange={setShowLightbox}
                />
            )}
        </div>
    );
}
