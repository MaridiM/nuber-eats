import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateAccountInput } from './dto/create-account.dto'
import { LoginInput } from './dto/login.dto'
import { User } from './entities/user.entity'
import { ConfigService } from '@nestjs/config'
import { JwtService } from 'src/jwt/jwt.service'
import { UpdateProfileInput } from './dto/update-profile.dto'
import { Verification } from './entities/verification.entity'
import { VerifyEmailOutput } from './dto/verify-email.dto'

type TUserResponse = {
    ok: boolean
    error?: string
    token?: string
}

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private readonly users: Repository<User>,
        @InjectRepository(Verification) private readonly verifications: Repository<Verification>,
        private readonly config: ConfigService, // imported into user module
        private readonly jwtService: JwtService, // Custom service
    ) {}

    async createAccount({ email, password, role }: CreateAccountInput): Promise<TUserResponse> {
        try {
            // Check if exists email
            const exists = await this.users.findOne({ where: { email } })
            // Make error if error is exist
            if (exists) {
                // Make error,
                return {
                    ok: false,
                    error: 'There is user with that email already',
                }
            }

            //Create and Save id DB
            const user = await this.users.save(this.users.create({ email, password, role }))
            await this.verifications.save(this.verifications.create({ user }))

            return { ok: true }
        } catch (error) {
            // Make error
            console.log(error)
            return {
                ok: false,
                error: "Couldn't create account",
            }
        }
        // & hash the password
    }

    async login({ email, password }: LoginInput): Promise<TUserResponse> {
        // Find the user with the email
        // Check if the password is correct
        // Make a JWR and give it to the user
        try {
            const user = await this.users.findOne({
                where: { email },
                select: ['id', 'password'],
            })
            if (!user) {
                return {
                    ok: false,
                    error: 'User not found',
                }
            }

            const passwordCorrect = await user.checkPassword(password)
            if (!passwordCorrect) {
                return {
                    ok: false,
                    error: 'Wrong password',
                }
            }
            const token = this.jwtService.sign({ id: user.id }) // Make JWT token custom jwt module

            return {
                ok: true,
                token,
            }
        } catch (error) {
            return {
                ok: false,
                error,
            }
        }
    }

    async findById(id: number): Promise<User> {
        return this.users.findOne({ where: { id } })
    }

    async updateProfile(userId: number, { email, password }: UpdateProfileInput) {
        const user = await this.users.findOne({ where: { id: userId } })
        console.log(user)
        if (email) {
            user.email = email
            user.verified = false
            await this.verifications.save(this.verifications.create({ user }))
        }
        if (password) {
            user.password = password
        }

        return this.users.save(user)
    }

    async verifyEmail(code: string): Promise<VerifyEmailOutput> {
        try {
            const verification = await this.verifications.findOne({
                where: { code },
                relations: ['user'], // Add to answer all user's data
                //loadRelationIds: true, // Add to answer User's id
            })
            if (verification) {
                verification.user.verified = true
                await this.users.save(verification.user)
                await this.verifications.delete(verification.id)
                return { ok: true }
            }
            throw new Error()
        } catch (error) {
            console.log(error)
            return { ok: false, error }
        }
    }
}
