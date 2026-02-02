import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { postService } from '@/services/post.service';
import { SocialPost } from '@/components/posts/Social';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

const PostDetail = () => {
    const { id } = useParams();

    const { data: post, isLoading, refetch } = useQuery({
        queryKey: ['post', id],
        queryFn: () => postService.getById(id!),
        enabled: !!id
    });

    if (isLoading) {
        return (
            <div className="max-w-xl mx-auto py-20 text-center text-zinc-500">
                Loading post...
            </div>
        );
    }

    if (!post) {
        return (
            <div className="max-w-xl mx-auto py-20 text-center space-y-4">
                <p className="text-zinc-500 text-lg font-medium">Post not found</p>
                <Button asChild variant="outline">
                    <Link to={ROUTES.INDEX}>Back to Home</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto space-y-4">
            <div className="flex items-center gap-4 mb-2">
                <Button variant="ghost" size="icon" asChild className="rounded-full">
                    <Link to={ROUTES.INDEX}>
                        <ArrowLeft className="size-5" />
                    </Link>
                </Button>
                <h1 className="text-xl font-bold">Post</h1>
            </div>

            <SocialPost 
                post={post} 
                onDelete={() => {}} // Home handling will redirect or refetch
                onUpdate={refetch}
            />
        </div>
    );
}

export default PostDetail;
