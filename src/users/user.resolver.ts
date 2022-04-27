import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql'
import { User } from './entities/user.entity'
import { UsersService } from './user.service'
import { LoginOutput, LoginInput } from './dto/login.dto'
import { CreateAccountInput, CreateAccountOutput } from './dto/create-account.dto'

@Resolver(() => User)
export class UsersResolver {
    constructor(private readonly usersService: UsersService) {}

    @Query(() => Boolean)
    usersQuery(): boolean {
        return true
    }

    @Mutation(() => CreateAccountOutput)
    async createAccount(
        @Args('input')
        createAccountInput: CreateAccountInput,
    ): Promise<CreateAccountOutput> {
        try {
            const { ok, error } = await this.usersService.createAccount(createAccountInput)
            return { ok, error }
        } catch (error) {
            return {
                error: error,
                ok: false,
            }
        }
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

    @Query(() => User)
    me(@Context() context) {
        // Get context and check by user
        if (!context.user) {
            return
        } else {
            return context.user
        }
        console.log(context)
    }
}
