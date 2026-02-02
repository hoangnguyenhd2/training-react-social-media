import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { commentService } from '@/services/comment.service';
import { useAuth } from '@/hooks/useAuth';
import { CommentItem } from './CommentItem';
import { CommentInput } from './CommentInput';
import type { Comment } from '@/types/post';

interface CommentSectionProps {
    postId: string;
    onCommentAdded?: () => void;
    onCommentDeleted?: () => void;
}

export function CommentSection({ postId, onCommentAdded, onCommentDeleted }: CommentSectionProps) {
    const { user } = useAuth();
    const [allComments, setAllComments] = useState<Comment[]>( [] );
    const [fetching, setFetching] = useState( true );
    const [visibleCount, setVisibleCount] = useState( 2 );
    const [loadingMore, setLoadingMore] = useState( false );

    const fetchComments = async () => {
        try {
            if ( allComments.length === 0 ) setFetching( true );
            const data = await commentService.getByPostId( postId );
            setAllComments( data );
        } catch ( err: any ) {
            console.error( 'Failed to fetch comments:', err );
            toast.error( 'Failed to load comments' );
        } finally {
            setFetching( false );
        }
    };

    useEffect( () => {
        fetchComments();
    }, [postId]);

    const handleAddComment = async ( content: string, imageFile?: File ) => {
        try {
            await commentService.add( postId, content, null, imageFile );
            toast.success( 'Comment posted' );
            await fetchComments(); 
            // Nếu có ít hơn 2 comment thì có thể reset về 2, 
            // nhưng tốt nhất là giữ nguyên để user thấy comment vừa đăng
            if ( visibleCount < allComments.length + 1 ) {
                setVisibleCount( prev => prev + 1 );
            }
            onCommentAdded?.();
        } catch ( err: any ) {
            toast.error( err.message || 'Failed to post' );
        }
    };

    const handleLoadMore = () => {
        setLoadingMore( true );
        // Giả lập load cho mượt
        setTimeout( () => {
            setVisibleCount( prev => prev + 5 );
            setLoadingMore( false );
        }, 500 );
    };

    const displayedComments = allComments.slice( 0, visibleCount );
    const hasMore = allComments.length > visibleCount;

    return (
        <div className="border-t border-zinc-100 dark:border-zinc-800 px-4 py-3 space-y-4">
            {/* Input */}
            {user && (
                <CommentInput 
                    onSubmit={handleAddComment} 
                    className="mb-4"
                />
            )}

            {/* List */}
            <div className="space-y-4">
                {fetching ? (
                    <div className="space-y-4">
                        {[1, 2].map( i => (
                            <div key={i} className="flex gap-3 animate-pulse">
                                <div className="size-8 bg-zinc-100 dark:bg-zinc-800 rounded-full" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded w-1/4" />
                                    <div className="h-10 bg-zinc-100 dark:bg-zinc-800 rounded w-3/4" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : allComments.length === 0 ? (
                    <div className="text-center py-6 text-sm text-zinc-500 italic">
                        Be the first to comment! 🚀
                    </div>
                ) : (
                    <>
                        <div className="space-y-6">
                            {displayedComments.map( ( comment ) => (
                                <CommentItem 
                                    key={comment.id} 
                                    comment={comment} 
                                    onDeleted={() => {
                                        setAllComments( prev => prev.filter( c => c.id !== comment.id ) );
                                        onCommentDeleted?.();
                                    }}
                                    onUpdated={fetchComments}
                                />
                            ))}
                        </div>

                        {hasMore && (
                            <button
                                onClick={handleLoadMore}
                                disabled={loadingMore}
                                className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:underline py-2 w-full text-left ml-11"
                            >
                                {loadingMore ? 'Loading more...' : 'View more comments'}
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
