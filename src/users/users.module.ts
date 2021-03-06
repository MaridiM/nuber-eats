import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { Verification } from './entities/verification.entity'
import { UsersResolver } from './user.resolver'
import { UsersService } from './users.service'

@Module({
    imports: [TypeOrmModule.forFeature([User, Verification])],
    providers: [UsersService, UsersResolver],
    exports: [UsersService],
})
export class UsersModule {}
