// Build route with params
export function buildRoute(path: string, params: Record<string, any>) {
    return path.replace(/:([a-zA-Z_]+)/g, (_, key) => String(params[key]));
}

// Format number with locale
export function numberFormat(value: number | string) {
    return Number(value).toLocaleString('en-US');
}

// Format relative time (e.g., "2 hours ago", "Just now")
export function timeAgo(date: Date | string | number | { seconds: number } | null | undefined): string {
    if (!date) return 'Just now';
    
    // Handle Firestore Timestamp
    let timestamp: number;
    if (typeof date === 'object' && 'seconds' in date) {
        timestamp = date.seconds * 1000;
    } else if (date instanceof Date) {
        timestamp = date.getTime();
    } else if (typeof date === 'string') {
        timestamp = new Date(date).getTime();
    } else {
        timestamp = date;
    }

    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    
    return new Date(timestamp).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
    });
}
