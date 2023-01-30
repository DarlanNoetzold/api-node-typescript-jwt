import { Router } from 'express'
import { sign } from 'jsonwebtoken'

import { AuthController } from '../controller/AuthController'
import { STATUS, User } from '../entity/User'
import { SECRET } from '../config/secret'

const fs = require('fs');
const ytdl = require('ytdl-core');

export const authRouter = Router()

authRouter.post('/register', async (req, res) => {
    const { email, name, password } = req.body

    const user: User = new User(email, name, password)
    const response = user.isValid()

    if (response == STATUS.OK) {
        const authCtrl = new AuthController()
        try {
            const savedUser = await authCtrl.registerUser(user)
            return res.json(savedUser)
        } catch (error) {
            return res.status(500).json({ message: STATUS.REGISTER_ERROR })
        }
    } else {
        return res.status(400).json({ message: response })
    }
})

authRouter.post('/login', async (req, res) => {
    const { email, password } = req.body

    const authCtrl = new AuthController()
    const user = await authCtrl.findUserByEmail(email)
    if (user && user.isPasswordCorrect(password)) {
        const token = sign(
            { user: email, timestamp: new Date() },
            SECRET,
            {
                expiresIn: '20s'
            }
        )

        res.json({
            authorized: true,
            user,
            token
        })
    } else {
        return res.status(401).json({
            authorized: false,
            message: STATUS.NOT_AUTHORIZED
        })
    }
})

authRouter.get('/new_endpoint', AuthController.verifyToken, (req, res) => {
    const { url } = req.query;
    res.header("Content-Disposition", 'attachmentt; filename="video.mp4"');
    return ytdl(url).pipe(res);
})  