import { Application } from 'express'
import { BaseController } from '.'
import { userRepository } from '../repositories'
import { AppRequest, AppResponse } from '../models'
import { CONSTANTS } from '../utils'
import { exceptionHandler } from '../handlers/exception.handler'
import { validationErrorHandler } from '../handlers/validation-error.handler'

export class UserController extends BaseController {

    route(app: Application) {
        app.get('/user', (req, res) => void exceptionHandler(req, res, this.getAll))
        app.post('/user', (req, res) => void exceptionHandler(req, res, this.createUser))
        app.get('/user-exists/:username', (req, res) => void exceptionHandler(req, res, this.userExists))
        app.post('/login', (req, res) => void exceptionHandler(req, res, this.login))
        app.get('/logout', (req, res) => void exceptionHandler(req, res, this.logout))
    }

    private async getAll(req: AppRequest, res: AppResponse) {
        res.json(await userRepository.getAll())
    }

    private async createUser(req: AppRequest, res: AppResponse) {
        const { username, password, type } = req.body || {}

        await userRepository.createUser(username.toLowerCase(), password, type)
        return res.json({ message: 'Usuário criado com sucesso.' })
    }

    private async userExists(req: AppRequest, res: AppResponse) {
        const { username } = req.params || {}

        if (!username)
            return res.json({ exists: false })

        const user = await userRepository.findUserByUsername(username.toLowerCase())
        return res.json({ exists: !!user })
    }

    private async login(req: AppRequest, res: AppResponse) {
        const { username, password } = req.body || {}

        if (!username || !password)
            return validationErrorHandler('Os campos nome e senha são obrigatórios.', res)

        const user = await userRepository.findUserByUsername(username.toLowerCase())

        if (!user)
            return validationErrorHandler('O nome informado não foi encontrado.', res)

        if (user.password !== password)
            return validationErrorHandler('A senha informada é inválida.', res)

        const token = Buffer.from(JSON.stringify({ id: user.id, username, type: user.type })).toString('base64')

        res.cookie(CONSTANTS.TOKEN_KEY, token)

        res.json({ message: 'Autenticado com sucesso.' })
    }

    private async logout(req: AppRequest, res: AppResponse) {

        res.clearCookie(CONSTANTS.TOKEN_KEY, { path: '/' })
        res.json({ message: 'Logout efetuado com sucesso.' })
    }
}