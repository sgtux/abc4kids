import { Request, Response } from 'express'


export class ValidationError {

    error: string

    constructor(error: string) {
        this.error = error
    }

}

export interface AppRequest extends Request {
    id: string
    user: User
}

export interface AppResponse extends Response {
    errors: string[]
}

export interface User {
    id: number
    username: string
    password: string
    type: UserType
    avatar: number
}

export enum UserType {
    Teacher = 1,
    Student = 2
}

export interface Room {
    id: number
    teacherId: number
    description: string
    status: string
}

export interface RoomWord {
    roomId: number
    word: string
}

export interface RoomStudent {
    roomId: number
    studentId: number
}