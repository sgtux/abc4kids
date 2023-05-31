import { Request } from 'express'


export class ValidationError {

    error: string

    constructor(error: string) {
        this.error = error
    }

}

export interface AppRequest extends Request {
    user: User
}

export interface User {
    id: number
    username: string
    teacher: boolean
}