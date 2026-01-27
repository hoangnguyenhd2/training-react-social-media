import { createContext, useState } from "react"
import { Spinner } from "@/components/ui/spinner";

interface LoaderContextProps {
    loading: boolean
    setLoading: (value: boolean) => void
}

export const LoaderContext = createContext<LoaderContextProps | null>(null);

export const LoaderProvider = ({ children } : { children: React.ReactNode }) => {
    const [ loading, setLoading ] = useState<LoaderContextProps['loading']>(false);
    return (
        <LoaderContext.Provider value={{ loading, setLoading }}>
            {children}
            {loading && (
                <div className="fixed inset-0 z-9999 grid place-items-center bg-muted/40">
                    <Spinner className="size-15" />
                </div>
            )}
        </LoaderContext.Provider>
    )
}