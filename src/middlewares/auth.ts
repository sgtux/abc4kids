import { NextFunction, Request, Response } from 'express'

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {

    if (req.method.toLowerCase() === 'post' && (req.url === '/token' || req.url === '/user'))
        return next()

    const token = req.headers['token']
    if (!token)
        return res.status(401).end()
    try {
        (req as any).user = JSON.parse(Buffer.from(token as string, 'base64').toString('utf8'))
    } catch (ex) {
        console.log(ex)
        return res.status(401).end()
    }
    console.log((req as any).user)
    res.end()
}