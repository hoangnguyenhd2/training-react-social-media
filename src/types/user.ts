
export type Role = 'admin' | 'user';

export interface User {
    id: string
    username: string
    password?: string
    email: string
    name: string
    avatar: string
    role: Role
    access_token?: string
    created_at?: Date | string | { seconds: number; nanoseconds: number }
    updated_at?: Date | string | { seconds: number; nanoseconds: number }
}
