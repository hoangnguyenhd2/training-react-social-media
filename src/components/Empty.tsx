import { BadgeAlert } from "lucide-react"

export function Empty ({ message = 'Empty component' }) {
    return (
        <div className="grid place-items-center gap-y-2">
            <BadgeAlert size={96} className="text-muted/45" />
            <h2 className="text-2xl text-muted/80 font-bold">
                {message}
            </h2>
        </div>
    )
}