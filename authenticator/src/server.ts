import { app } from './app'

const PORT = process.env.PORT || 3000

const server = app.listen(PORT, () => console.log(`App running on port ${PORT}`))

process.on('SIGINT', () => {
    server.close()
    console.log('App finished')
})

