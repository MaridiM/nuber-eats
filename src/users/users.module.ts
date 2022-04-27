import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { UsersResolver } from './user.resolver'
import { UsersService } from './user.service'

@Module({
    imports: [TypeOrmModule.forFeature([User]), ConfigService],
    providers: [UsersService, UsersResolver],
    exports: [UsersService],
})
export class UsersModule {}
