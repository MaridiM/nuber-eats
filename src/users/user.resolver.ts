import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { User } from './entities/user.entity'
import { UsersService } from './user.service'
import { LoginOutput, LoginInput } from './dto/login.dto'
import { CreateAccountInput, CreateAccountOutput } from './dto/create-account.dto'
import { UseGuards } from '@nestjs/common'
import { AuthGuard } from 'src/auth/auth.guard'
import { AuthUser } from 'src/auth/auth-user.decorator'
import { UserProfileInput, UserProfileOutput } from './dto/user-profile.dto'
import { UpdateProfileInput, UpdateProfileOutput } from './dto/update-profile.dto'
import { VerifyEmailInput, VerifyEmailOutput } from './dto/verify-email.dto'

@Resolver(() => User)
export class UsersResolver {
    constructor(private readonly usersService: UsersService) {}

    @Mutation(() => CreateAccountOutput)
    async createAccount(
        @Args('input')
        createAccountInput: CreateAccountInput,
    ): Promise<CreateAccountOutput> {
        return this.usersService.createAccount(createAccountInput)
    }

    @Mutation(() => LoginOutput)
    async login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
        try {
            const { ok, error, token } = await this.usersService.login(loginInput)
            return { ok, error, token }
        } catch (error) {
            console.log(error)
            return {
                ok: false,
                error,
                token: null,
            }
        }
    }

    @UseGuards(AuthGuard) // Chack to req.user exist or not, use our custom guards
    @Query(() => User)
    me(@AuthUser() authUser: User) {
        return authUser
    }

    @UseGuards(AuthGuard)
    @Query(() => UserProfileOutput)
    async userProfile(@Args() userProfileInput: UserProfileInput): Promise<UserProfileOutput> {
        try {
            const user = await this.usersService.findById(userProfileInput.userId)
            if (!user) throw Error()
            return {
                ok: Boolean(user),
                user,
            }
        } catch (error) {
            return {
                error: 'User is not found',
                ok: false,
            }
        }
    }

    @UseGuards(AuthGuard)
    @Mutation(() => UpdateProfileOutput)
    async updateProfile(
        @AuthUser() authUser: User,
        @Args('input') updateProfileInput: UpdateProfileInput,
    ): Promise<UpdateProfileOutput> {
        try {
            const res = await this.usersService.updateProfile(authUser.id, updateProfileInput)
            console.log(res)
            return {
                ok: true,
            }
        } catch (error) {
            return {
                ok: false,
                error,
            }
        }
    }

    @Mutation(() => VerifyEmailOutput)
    async verifyEmail(@Args('input') { code }: VerifyEmailInput): Promise<VerifyEmailOutput> {
        return await this.usersService.verifyEmail(code)
    }
}
