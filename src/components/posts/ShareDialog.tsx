import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Copy, Facebook, Instagram, Twitter, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ShareDialogProps {
    open: boolean;
    onOpenChange: ( open: boolean ) => void;
    url: string;
    title?: string;
}

export function ShareDialog({ open, onOpenChange, url, title = "Share this post" }: ShareDialogProps) {
    const [copied, setCopied] = useState( false );

    const shareLinks = [
        {
            name: "Facebook",
            icon: Facebook,
            color: "text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20",
            href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent( url )}`,
        },
        {
            name: "X (Twitter)",
            icon: Twitter,
            color: "text-black dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800",
            href: `https://twitter.com/intent/tweet?url=${encodeURIComponent( url )}&text=${encodeURIComponent( title )}`,
        },
        {
            name: "Instagram",
            icon: Instagram,
            color: "text-pink-600 hover:bg-pink-50 dark:hover:bg-pink-900/20",
            onClick: () => handleCopy(), // Insta web doesn't support direct URL sharing
        }
    ];

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText( url );
            setCopied( true );
            toast.success( "Link copied to clipboard!" );
            setTimeout( () => setCopied( false ), 2000 );
        } catch ( err ) {
            toast.error( "Failed to copy link" );
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Share Post</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-3 gap-4 py-4">
                    {shareLinks.map( ( platform ) => (
                        <a
                            key={platform.name}
                            href={platform.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={platform.onClick}
                            className={cn(
                                "flex flex-col items-center gap-2 p-4 rounded-xl transition-colors cursor-pointer",
                                platform.color
                            )}
                        >
                            <platform.icon className="size-8" />
                            <span className="text-xs font-medium">{platform.name}</span>
                        </a>
                    ))}
                </div>
                <div className="flex items-center space-x-2 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                    <div className="grid flex-1 gap-2">
                        <label htmlFor="link" className="sr-only">
                            Link
                        </label>
                        <input
                            id="link"
                            defaultValue={url}
                            readOnly
                            className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-400"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={handleCopy}
                        className="px-3 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-md hover:opacity-90 transition-opacity flex items-center justify-center min-w-[80px]"
                    >
                        {copied ? (
                            <Check className="size-4" />
                        ) : (
                            <Copy className="size-4" />
                        )}
                        <span className="ml-2 text-xs font-semibold">{copied ? "Copied" : "Copy"}</span>
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
