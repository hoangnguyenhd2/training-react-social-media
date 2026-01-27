import { type User } from '@/types/user';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export const UserAvatar = ({ user, ...props } : { className: string, user: User }) => {
    return (
        <Avatar {...props}>
            <AvatarImage 
                src={user.avatar} 
                alt={user.username} 
            />
            <AvatarFallback>{user.username.slice(2).toUpperCase()}</AvatarFallback>
        </Avatar>
    )
}