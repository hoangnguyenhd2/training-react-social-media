import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileText, Heart, TrendingUp } from 'lucide-react';
import { adminService } from '@/services/admin.service';

const AdminDashboard = () => {
    const { data: stats, isLoading } = useQuery({
        queryKey: ['admin', 'stats'],
        queryFn: adminService.getStats
    });

    const cards = [
        { title: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950' },
        { title: 'Total Posts', value: stats?.totalPosts || 0, icon: FileText, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-950' },
        { title: 'Posts Today', value: stats?.todayPosts || 0, icon: TrendingUp, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-950' },
        { title: 'Total Likes', value: stats?.totalLikes || 0, icon: Heart, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-950' }
    ];

    if (isLoading) {
        return <div className="text-center py-20 text-zinc-500">Loading...</div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <p className="text-zinc-500 text-sm mt-1">Overview of your platform</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {cards.map(card => (
                    <Card key={card.title} className={`${card.bg} border-0`}>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
                                <card.icon className={`size-4 ${card.color}`} />
                                {card.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">{card.value.toLocaleString()}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default AdminDashboard;
