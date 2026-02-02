import { createContext, useState, useCallback, useMemo } from "react";
import { Loader } from "@/components/shared/Loader";

interface LoaderContextProps {
    loading: boolean;
    setLoading: (value: boolean) => void;
}

export const LoaderContext = createContext<LoaderContextProps | null>(null);

export function LoaderProvider({ children }: { children: React.ReactNode }) {
    const [loading, setLoadingState] = useState(false);

    const setLoading = useCallback((value: boolean) => {
        setLoadingState(value);
    }, []);

    const value = useMemo(
        () => ({ loading, setLoading }),
        [loading, setLoading]
    );

    return (
        <LoaderContext.Provider value={value}>
            {children}
            {loading && <Loader />}
        </LoaderContext.Provider>
    );
}
