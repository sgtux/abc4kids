import { AppResponse } from "../models"

export function validationErrorHandler(message: string, res: AppResponse) {
    res.json({ errors: [message] })
}