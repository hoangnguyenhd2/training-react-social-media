import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface UserAvatarProps {
    user: {
        name?: string;
        username?: string;
        avatar?: string;
    };
    className?: string;
}

export function UserAvatar({ user, className }: UserAvatarProps) {
    const initials = user.name?.slice(0, 2).toUpperCase() 
        || user.username?.slice(0, 2).toUpperCase() 
        || '?';
    
    return (
        <Avatar className={className}>
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
    );
}
