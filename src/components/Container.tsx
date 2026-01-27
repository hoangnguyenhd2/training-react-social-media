export function AuthContainer ({ children } : { children: React.ReactNode }) {
    return (
        <div className="lg:w-1/3 mx-auto">
            <div className="w-full">
                {children}
            </div>
        </div>
    )
}