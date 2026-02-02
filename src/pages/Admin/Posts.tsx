import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Eye, Trash2, Heart, MessageCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserAvatar } from '@/components/users/User';
import { DataTable } from '@/components/shared/DataTable';
import { ActionMenu } from '@/components/shared/ActionMenu';
import { adminService } from '@/services/admin.service';
import { useLoader } from '@/hooks/useLoader';
import { ROUTES } from '@/constants/routes';
import { timeAgo, buildRoute } from '@/utils/global';
import type { Post } from '@/types/post';
import type { ColumnDef } from '@tanstack/react-table';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const AdminPosts = () => {
    const navigate = useNavigate();
    const { setLoading } = useLoader();
    const [deletePost, setDeletePost] = useState<Post | null>(null);

    const { data: posts = [], refetch } = useQuery({
        queryKey: ['admin', 'posts'],
        queryFn: adminService.getPosts
    });

    const handleDelete = async () => {
        if (!deletePost) return;
        try {
            setLoading(true);
            await adminService.deletePost(deletePost.id);
            toast.success('Post deleted');
            refetch();
        } catch (err: any) {
            toast.error(err.message || 'Failed to delete');
        } finally {
            setLoading(false);
            setDeletePost(null);
        }
    };

    const columns: ColumnDef<Post>[] = [
        {
            accessorKey: 'id',
            header: 'ID',
            enableHiding: true, // Ẩn cột này nếu không muốn hiển thị
        },
        {
            accessorKey: 'content',
            header: 'Post',
            cell: ({ row }) => (
                <div className="flex items-start gap-3 max-w-sm">
                    {row.original.image_urls && row.original.image_urls.length > 0 && (
                        <img src={row.original.image_urls[0]} alt="" className="size-10 rounded object-cover" />
                    )}
                    <div>
                        <p className="text-sm line-clamp-2">{row.original.content}</p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-zinc-500">
                            <span className="flex items-center gap-1"><Heart className="size-3" /> {row.original.count.like}</span>
                            <span className="flex items-center gap-1"><MessageCircle className="size-3" /> {row.original.count.comment}</span>
                        </div>
                    </div>
                </div>
            )
        },
        {
            accessorKey: 'user.name',
            header: 'Author',
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <UserAvatar user={row.original.user || {}} className="size-6" />
                    <span className="text-sm">{row.original.user?.name || 'Unknown'}</span>
                </div>
            )
        },
        {
            accessorKey: 'created_at', // Sửa từ 'createdAt' thành 'created_at'
            header: 'Date',
            cell: ({ row }) => <span className="text-sm text-zinc-500">{timeAgo(row.original.created_at)}</span>
        },
        {
            accessorKey: 'score',
            header: 'Score',
            enableSorting: true,
            cell: ({ row }) => <Badge variant="outline" className="font-bold">{row.original.score}</Badge>
        },
        {
            id: 'actions',
            header: '',
            cell: ({ row }) => (
                <ActionMenu items={[
                    { 
                        label: 'View', 
                        onClick: () => navigate(buildRoute(ROUTES.POST_DETAIL, { id: row.original.id })),
                        icon: <Eye className="size-4 mr-2" />
                    },
                    { 
                        label: 'Delete', 
                        onClick: () => setDeletePost(row.original),
                        icon: <Trash2 className="size-4 mr-2" />,
                        variant: 'danger'
                    }
                ]} />
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Posts</h1>
                <p className="text-zinc-500 text-sm">{posts.length} total</p>
            </div>

            <Card>
                <CardContent className="pt-6">
                    <DataTable data={posts} columns={columns} />
                </CardContent>
            </Card>

            <AlertDialog open={!!deletePost} onOpenChange={() => setDeletePost(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Post</AlertDialogTitle>
                        <AlertDialogDescription>
                            Delete this post? This cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction className="bg-red-500 hover:bg-red-600" onClick={handleDelete}>
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default AdminPosts;
