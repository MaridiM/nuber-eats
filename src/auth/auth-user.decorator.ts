import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

// Decorator for getting user from GQL Context
export const AuthUser = createParamDecorator((data: unknown, context: ExecutionContext) => {
    const gqlContext = GqlExecutionContext.create(context).getContext() //GEt  context from GQL getContext
    const user = gqlContext['user']
    return user
})
