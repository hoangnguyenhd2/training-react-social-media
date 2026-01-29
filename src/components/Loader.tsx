import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

export function Loader ({ className } : { className?: string }) {
    return (
        <div className={cn("fixed inset-0 z-9999 grid place-items-center bg-muted/40", className)}>
            <Spinner className="size-15" />
        </div>
    )
}