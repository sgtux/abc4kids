import { Application } from 'express'

import { createUser, findUserByUsername } from './db'
import { handleException } from './utils'

export default (app: Application) => {
    app.post('/user', async (req, res) => {
        try {
            const { username, password, teacher } = req.body || {}
            await createUser(username, password, teacher)
            res.end()
        } catch (ex) {
            handleException(ex, res)
        }
    })

    app.post('/token', async (req, res) => {
        try {
            const { username, password } = req.body || {}

            const user = (await findUserByUsername(username))?.toJSON()

            if (!user || user.password !== password)
                return res.json({ errors: ['Nome ou senha inválido.'] })

            const token = Buffer.from(JSON.stringify({ id: user.id, username, teacher: user.teacher })).toString('base64')

            res.json({ token })
        } catch (ex) {
            console.log(ex)
            res.end()
        }
    })
}