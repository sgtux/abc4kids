import express from 'express'
import bodyparser from 'body-parser'
import cookieparser from 'cookie-parser'

import { BaseController } from './controllers'
import { authMiddleware } from './middlewares'
import { AppRequest } from './models'
import { UserController } from './controllers/user.controller'
import { RoomController } from './controllers/room.controller'
import { synchronizeDatabase } from './repositories'

export class App {

    private port: number

    private app: express.Application

    constructor(port: number) {
        this.port = port
        this.app = express()

        this.initializeMiddlewares()
        this.initializeControllers()
    }

    private initializeMiddlewares() {
        this.app.use(express.static('public'))
        this.app.use(cookieparser())
        this.app.use(bodyparser.json())
        this.app.use((req, res, next) => authMiddleware(req as AppRequest, res, next))
    }

    private initializeControllers() {

        const controllers: BaseController[] = [new UserController(), new RoomController]

        for (const controller of controllers) {
            controller.route(this.app)
        }
    }

    listen(callback: (() => void)) {
        this.app.listen(this.port, callback)
    }

    getExpressApp() {
        return this.app
    }

    async synchronizeDatabase(force = false) {
        await synchronizeDatabase(force)
    }
}