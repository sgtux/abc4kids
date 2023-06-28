import { NextFunction, Response } from 'express'
import { AppRequest } from '../models'
import { CONSTANTS } from '../utils'

const FREE_PATHS = ['/token', '/user', '/login']

export const authMiddleware = (req: AppRequest, res: Response, next: NextFunction) => {

    if (req.method.toLowerCase() === 'post' && FREE_PATHS.includes(req.url))
        return next()

    if (req.method.toLowerCase() === 'get' && req.url.startsWith('/user-avatar'))
        return next()

    try {
        const token = req.cookies[CONSTANTS.TOKEN_KEY]
        if (!token)
            return res.status(401).end()

        req.user = JSON.parse(Buffer.from(token as string, 'base64').toString('utf8'))

        next()

    } catch (ex) {

        console.log(ex)

        res.status(401).end()
    }
}