import { useAuth } from "./useAuth";
import { useLoader } from "./useLoader";

type MethodOption = 'POST' | 'GET';

type RequestOption = {
    method: MethodOption
    url: string
    body?: any,
    params?: Record<string, string>
    headers?: Record<string, string>
};

export const useApi = () => {
    const token          = localStorage.getItem('token') || null;
    const { setLoading } = useLoader();

    const fetchApi = async <T,>( options: RequestOption ) : Promise<T> => {
        const { method, url, body, params, headers } = options;

        let requestConfig = {
            method,
            body,
            params,
            headers
        };

        requestConfig.headers = {
            'Accept': 'application/json',
            'Content-type': 'application/json',
            ...headers
        };

        if (token) {
            requestConfig.headers['Authorization'] = `Bearer ${token}`;
        }

        switch ( method ) {
            case 'POST':
                requestConfig.body = JSON.stringify(body);
                break;
        }

        try {
            setLoading(true);
            const response     = await fetch(url, requestConfig);
            const responseType = response.headers?.get('Content-type');
            return (responseType && responseType.includes('application/json')) ? response.json() : (response as unknown as T);
        } catch ( err: any ) {
            throw err;
        } finally {
            setLoading(false);
        }
    }

    return {
        post: <T>( url: string, body?: any, options?: Record<string, string> ) => fetchApi<T>({
            method: 'POST',
            url, 
            body, 
            ...options
        }),
        get: <T>( url: string, params?: any, options?: Record<string, string> ) => fetchApi<T>({
            method: 'GET',
            url, 
            params, 
            ...options
        })
    }

}