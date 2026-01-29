// @ts-nocheck
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { postService } from '@/services/post.service';
import { DataTable } from '@/components/DataTable';
import { Eye, ThumbsUp, Share2, MessageSquare } from 'lucide-react';
import { useMemo } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { numberFormat } from '@/utils/global';

const PostAnalytics = () => {
    const { id } = useParams();

    const { data: analytics = [] } = useQuery({
        queryKey: ['post-analytics', id],
        queryFn: () => postService.getAnalytics(id!),
        enabled: !!id
    });

    const stats = useMemo(() => {
        return {
            totalViews: analytics.reduce((acc, curr) => acc + (curr.views || 0), 0),
            totalLikes: analytics.reduce((acc, curr) => acc + (curr.likes || 15), 0),
            totalShares: analytics.reduce((acc, curr) => acc + (curr.shares || 5), 0),
            totalComments: analytics.reduce((acc, curr) => acc + (curr.comments || 2), 0)
        }
    }, [analytics]);

    // @ts-ignore
    const columns = useMemo<ColumnDef<any>[]>(() => [
        {
            accessorKey: 'id',
            header: 'ID',
            enableSorting: true
        },
        {
            accessorKey: 'date',
            header: 'Date',
            enableSorting: true
        },
        {
            accessorKey: 'description',
            header: 'Description',
            enableSorting: true
        },
        {
            accessorKey: 'views',
            header: 'Views',
            cell: (info: any) => (
                <div className="flex items-center gap-2 font-medium">
                    <Eye className="size-3.5 text-blue-500" />
                    {numberFormat(info.getValue())}
                </div>
            ),
            enableSorting: true
        },
        {
            accessorKey: 'likes',
            header: 'Likes',
            cell: (info: any) => (
                <div className="flex items-center gap-2 font-medium">
                    <ThumbsUp className="size-3.5 text-pink-500" />
                    {numberFormat(info.getValue() || 0)}
                </div>
            ),
            enableSorting: true
        },
        {
            accessorKey: 'shares',
            header: 'Shares',
            cell: (info: any) => (
                <div className="flex items-center gap-2 font-medium">
                    <Share2 className="size-3.5 text-green-500" />
                    {numberFormat(info.getValue() || 0)}
                </div>
            ),
            enableSorting: true
        },
        {
            accessorKey: 'comments',
            header: 'Comments',
            cell: (info: any) => (
                <div className="flex items-center gap-2 font-medium">
                    <MessageSquare className="size-3.5 text-orange-500" />
                    {numberFormat(info.getValue() || 0)}
                </div>
            ),
            enableSorting: true
        }
    ], []);

    return (
        <div className="container mx-auto max-w-6xl space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-none shadow-sm bg-blue-50/50 dark:bg-blue-900/10">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-medium text-blue-600 uppercase tracking-wider">Total Views</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{numberFormat(stats.totalViews)}</div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-pink-50/50 dark:bg-pink-900/10">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-medium text-pink-600 uppercase tracking-wider">Total Likes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{numberFormat(stats.totalLikes)}</div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-green-50/50 dark:bg-green-900/10">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-medium text-green-600 uppercase tracking-wider">Total Shares</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{numberFormat(stats.totalShares)}</div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-orange-50/50 dark:bg-orange-900/10">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-medium text-orange-600 uppercase tracking-wider">Comments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{numberFormat(stats.totalComments)}</div>
                    </CardContent>
                </Card>
            </div>
            <Card className="border-none shadow-lg overflow-hidden">
                <CardContent>
                    {/* @ts-ignore */}
                    <DataTable
                        data={analytics || []}
                        columns={columns}
                        pageSize={10}
                    />
                </CardContent>
            </Card>
        </div>
    )
}

export default PostAnalytics;