import { Request, Response } from 'express'
import { ValidationErrorItem } from 'sequelize'
import { AppRequest, AppResponse } from '../models'

export const exceptionHandler = async (req: Request, res: Response, fn: ((appReq: AppRequest, appRes: AppResponse) => Promise<void | AppResponse>)) => {
    try {
        await fn(req as AppRequest, res as AppResponse)
    } catch (ex) {
        const errors = (ex as any).errors
        if (errors && errors[0] instanceof ValidationErrorItem) {
            const errorsResult: string[] = []
            for (const err of errors) {
                const message = (err as ValidationErrorItem).message
                errorsResult.push(message)
            }

            res.status(400).json({ errors: errorsResult })
        } else {
            res.status(500).json({ text: 'Erro interno.', details: ex })
        }
    }
}