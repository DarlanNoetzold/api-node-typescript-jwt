import { NextFunction, Request, Response } from "express"
import { getMongoManager, MongoEntityManager } from "typeorm"
import { verify } from 'jsonwebtoken'

import { STATUS, User } from "../entity/User"
import { SECRET } from "../config/secret"

export class AuthController {

    entityManager: MongoEntityManager

    constructor() {
        this.entityManager = getMongoManager()
    }

    async registerUser(user: User): Promise<User> {
        delete user._password
        try {
            const savedUser = await this.entityManager.save(user)
            return savedUser
        } catch (error) {
            console.log(error)
            throw new Error(error)
        }
    }

    async findUserByEmail(email: string): Promise<User> {
        const user = await this.entityManager.findOneBy(User, { email: email })
        return user
    }

    static verifyToken(req: Request, res: Response, next: NextFunction) {
        let token = req.headers['authorization']
        if (token) {
            token = token.substring(7, token.length)

            try {
                verify(token, SECRET)
                next()
            } catch (error) {

            }
        }

        res.status(401).json({ message: STATUS.NOT_AUTHORIZED })
    }
}