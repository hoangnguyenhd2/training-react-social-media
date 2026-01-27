import { type User } from "./user";

export interface Post {
    id: string
    content: string
    count: {
        like: number
        comment: number
        share: number
    }
    actions: {
        liked: boolean
    }
    user: User
}