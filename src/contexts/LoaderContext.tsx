import { createContext, useState } from "react"
import { Loader } from "@/components/Loader";

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
            {loading && <Loader />}
        </LoaderContext.Provider>
    )
}