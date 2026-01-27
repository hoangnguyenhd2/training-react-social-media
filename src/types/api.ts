import { type User } from './user';

export type LoginResponse = User & {
    message?: string
}