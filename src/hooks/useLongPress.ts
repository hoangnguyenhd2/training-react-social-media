import { useCallback, useRef } from 'react';

interface UseLongPressOptions {
    onLongPress: () => void;
    onClick?: () => void;
    delay?: number;
}

export function useLongPress({ onLongPress, onClick, delay = 500 }: UseLongPressOptions) {
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isLongPress = useRef<boolean>(false);

    const start = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        isLongPress.current = false;
        timerRef.current = setTimeout(() => {
            isLongPress.current = true;
            onLongPress();
        }, delay);
    }, [onLongPress, delay]);

    const clear = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
    }, []);

    const handleClick = useCallback(() => {
        if (!isLongPress.current && onClick) {
            onClick();
        }
    }, [onClick]);

    return {
        onMouseDown: start,
        onMouseUp: clear,
        onMouseLeave: clear,
        onTouchStart: start,
        onTouchEnd: clear,
        onClick: handleClick
    };
}
