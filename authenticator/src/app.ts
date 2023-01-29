import * as express from 'express'
import * as cors from 'cors'
import * as logger from 'morgan'

import { connectToDB } from './config/db'
import { authRouter } from './route/auth'

export const app = express()

app.use(cors())
app.use(express.json())
app.use(logger('dev'))

connectToDB()

app.use('/auth', authRouter)

