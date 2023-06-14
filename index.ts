import { App } from './src/app'

const port = 3001

const app = new App(3001)

app.listen(() => {
    app.synchronizeDatabase()
        .then(() => console.info(`Listening on ${port} port.`))
        .catch(err => console.log(err))
})