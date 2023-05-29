import express from 'express'

const app = express()

app.use(express.static('public'))

app.get('/', (req, res) => {
    res.end('Hello World')
})

const port = 3001

app.listen(port, () => console.log(`Listening on ${port} port.`))