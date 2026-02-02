import { cn } from '@/lib/utils';
import type { ReactionType } from '@/types/post';

interface Reaction {
    type: ReactionType;
    emoji: string;
    label: string;
    color: string;
}

export const REACTIONS: Reaction[] = [
    { type: 'like', emoji: '👍', label: 'Like', color: 'text-blue-500' },
    { type: 'love', emoji: '❤️', label: 'Love', color: 'text-red-500' },
    { type: 'haha', emoji: '😂', label: 'Haha', color: 'text-yellow-500' },
    { type: 'wow', emoji: '😮', label: 'Wow', color: 'text-yellow-500' },
    { type: 'sad', emoji: '😢', label: 'Sad', color: 'text-yellow-500' },
    { type: 'angry', emoji: '😡', label: 'Angry', color: 'text-orange-500' }
];

export function getReaction(type: ReactionType | null) {
    return REACTIONS.find(r => r.type === type) || null;
}

interface ReactionPickerProps {
    visible: boolean;
    onSelect: (type: ReactionType) => void;
    onClose: () => void;
}

export function ReactionPicker({ visible, onSelect, onClose }: ReactionPickerProps) {
    if (!visible) return null;

    return (
        <>
            <div className="fixed inset-0 z-40" onClick={onClose} />
            <div className="absolute bottom-full left-0 mb-2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
                <div className="flex items-center gap-1 bg-white dark:bg-zinc-900 rounded-full shadow-lg border border-zinc-200 dark:border-zinc-700 px-2 py-1.5">
                    {REACTIONS.map((reaction, index) => (
                        <button
                            key={reaction.type}
                            onClick={() => {
                                onSelect(reaction.type);
                                onClose();
                            }}
                            className="text-2xl hover:scale-125 transition-transform p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full"
                            style={{ animationDelay: `${index * 30}ms` }}
                            title={reaction.label}
                        >
                            {reaction.emoji}
                        </button>
                    ))}
                </div>
            </div>
        </>
    );
}

export function ReactionDisplay({ reaction }: { reaction: ReactionType | null }) {
    const r = getReaction(reaction);
    if (!r) return null;

    return (
        <span className="flex items-center gap-1.5">
            <span className="text-base">{r.emoji}</span>
            <span className={cn('font-medium', r.color)}>{r.label}</span>
        </span>
    );
}
