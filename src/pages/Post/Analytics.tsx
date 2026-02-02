import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { postService } from '@/services/post.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Eye, Heart, MessageCircle, Share2 } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

const Analytics = () => {
    const { id } = useParams();

    const { data: post } = useQuery({
        queryKey: ['post', id],
        queryFn: () => postService.getById(id!),
        enabled: !!id
    });

    if (!post) {
        return (
            <div className="max-w-2xl mx-auto text-center py-20">
                <p className="text-zinc-500">Loading...</p>
            </div>
        );
    }

    const stats = [
        { label: 'Views', value: 0, icon: Eye, color: 'text-blue-500' },
        { label: 'Likes', value: post.count.like, icon: Heart, color: 'text-red-500' },
        { label: 'Comments', value: post.count.comment, icon: MessageCircle, color: 'text-green-500' },
        { label: 'Shares', value: post.count.share, icon: Share2, color: 'text-purple-500' },
    ];

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link to={ROUTES.INDEX}>
                        <ArrowLeft className="size-5" />
                    </Link>
                </Button>
                <h1 className="text-xl font-bold">Analytics</h1>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
                {stats.map(stat => (
                    <Card key={stat.label}>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs text-zinc-500 flex items-center gap-2">
                                <stat.icon className={`size-4 ${stat.color}`} />
                                {stat.label}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">{stat.value}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Post preview */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm">Post Content</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">{post.content}</p>
                    {post.image_urls && post.image_urls.length > 0 && (
                        <div className="grid grid-cols-2 gap-2 mt-4">
                            {post.image_urls.map( ( url ) => (
                                <img key={url} src={url} alt="" className="rounded-lg w-full aspect-video object-cover" />
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

export default Analytics;
