import { Observable } from 'rxjs'
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

@Injectable()
export class AuthGuard implements CanActivate {
    // Guard for checking authorization by context.
    // if user into the req, then return treu if not exist to return  false
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const qglContext = GqlExecutionContext.create(context).getContext()
        const user = qglContext['user']

        if (!user) {
            return false
        }
        return true
    }
}
