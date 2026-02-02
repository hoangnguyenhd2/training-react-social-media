import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export interface ActionItem {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
    variant?: 'default' | 'danger';
}

interface ActionMenuProps {
    items: ActionItem[];
}

export function ActionMenu({ items }: ActionMenuProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                    Actions
                    <MoreHorizontal className="size-4 ml-1" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
                {items.map((item, index) => (
                    <div key={index}>
                        {item.variant === 'danger' && index > 0 && <DropdownMenuSeparator />}
                        <DropdownMenuItem
                            onClick={item.onClick}
                            className={cn(item.variant === 'danger' && 'text-red-500 focus:text-red-500')}
                        >
                            {item.icon}
                            {item.label}
                        </DropdownMenuItem>
                    </div>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
