import { NextFunction, Request, Response } from "express"
import { getMongoManager, MongoEntityManager } from "typeorm"
import { verify, VerifyErrors } from 'jsonwebtoken'

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
        const user = await this.entityManager.findOne(User, {where: { email: email }})
        return user
    }

    static verifyToken(req: Request, res: Response, next: NextFunction) {
        let token = req.headers['authorization']
        if (token) {
            console.log(token)
            token = token.substring(7, token.length)
            verify(token, SECRET, function (err: VerifyErrors | null) {
                var msg = {auth: false, message: 'Failed to authenticate token.'};
                if (err) res.status(500).send(msg);
                console.log("teaste")
                return next();
            });               
        }else{
            res.status(401).json({ message: STATUS.NOT_AUTHORIZED })
        }

    }
}