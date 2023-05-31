import express from 'express'
import bodyparser from 'body-parser'

import { updateDb } from './src/db'
import router from './src/router'
import { authMiddleware } from './src/middlewares/auth'

const app = express()

app.use(express.static('public'))

app.use(bodyparser.json())

app.use(authMiddleware)

router(app)

updateDb()

const port = 3001

app.listen(port, () => console.log(`Listening on ${port} port.`))