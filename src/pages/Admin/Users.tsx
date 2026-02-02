import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Trash2, Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserAvatar } from '@/components/users/User';
import { DataTable } from '@/components/shared/DataTable';
import { ActionMenu } from '@/components/shared/ActionMenu';
import { adminService } from '@/services/admin.service';
import { useLoader } from '@/hooks/useLoader';
import type { User } from '@/types/user';
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

const AdminUsers = () => {
    const { setLoading } = useLoader();
    const [deleteUser, setDeleteUser] = useState<User | null>(null);

    const { data: users = [], refetch } = useQuery({
        queryKey: ['admin', 'users'],
        queryFn: adminService.getUsers
    });

    const handleDelete = async () => {
        if (!deleteUser) return;
        try {
            setLoading(true);
            await adminService.deleteUser(deleteUser.id);
            toast.success('User deleted');
            refetch();
        } catch (err: any) {
            toast.error(err.message || 'Failed to delete');
        } finally {
            setLoading(false);
            setDeleteUser(null);
        }
    };

    const handleToggleRole = async (user: User) => {
        const newRole = user.role === 'admin' ? 'user' : 'admin';
        try {
            setLoading(true);
            await adminService.updateUser(user.id, { role: newRole });
            toast.success(`User is now ${newRole}`);
            refetch();
        } catch (err: any) {
            toast.error(err.message || 'Failed to update');
        } finally {
            setLoading(false);
        }
    };

    const columns: ColumnDef<User>[] = [
        {
            accessorKey: 'id',
            header: 'ID',
            enableHiding: true, // Ẩn cột này nếu không muốn hiển thị
        },
        {
            accessorKey: 'name',
            header: 'User',
            cell: ({ row }) => (
                <div className="flex items-center gap-3">
                    <UserAvatar user={row.original} className="size-8" />
                    <div>
                        <p className="font-medium">{row.original.name}</p>
                        <p className="text-xs text-zinc-500">{row.original.email}</p>
                    </div>
                </div>
            )
        },
        {
            accessorKey: 'role',
            header: 'Role',
            cell: ({ row }) => (
                <Badge variant={row.original.role === 'admin' ? 'default' : 'secondary'}>
                    {row.original.role}
                </Badge>
            )
        },
        {
            id: 'actions',
            header: '',
            cell: ({ row }) => (
                <ActionMenu items={[
                    { 
                        label: row.original.role === 'admin' ? 'Demote' : 'Promote', 
                        onClick: () => handleToggleRole(row.original),
                        icon: <Shield className="size-4 mr-2" />
                    },
                    { 
                        label: 'Delete', 
                        onClick: () => setDeleteUser(row.original),
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
                <h1 className="text-2xl font-bold">Users</h1>
                <p className="text-zinc-500 text-sm">{users.length} total</p>
            </div>

            <Card>
                <CardContent className="pt-6">
                    <DataTable data={users} columns={columns} />
                </CardContent>
            </Card>

            <AlertDialog open={!!deleteUser} onOpenChange={() => setDeleteUser(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete User</AlertDialogTitle>
                        <AlertDialogDescription>
                            Delete <strong>{deleteUser?.name}</strong>? This cannot be undone.
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

export default AdminUsers;
