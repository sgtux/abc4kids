import { Response } from 'express'
import { ValidationErrorItem } from 'sequelize'

export function handleException(ex: any, res: Response) {
    const errors = (ex as any).errors
    if (errors && errors[0] instanceof ValidationErrorItem) {
        const errorsResult: string[] = []
        for (const err of errors) {
            const message = (err as ValidationErrorItem).message
            errorsResult.push(message)
        }
        res.status(400).json({ errors: errorsResult })
    } else {
        console.log(ex)
        res.status(500).end('Erro interno.')
    }
}