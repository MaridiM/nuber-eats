import * as bcrypt from 'bcrypt'
import { Field, InputType, ObjectType, registerEnumType } from '@nestjs/graphql'
import { CoreEntity } from 'src/common/entities/core.entity'
import { BeforeInsert, Column, Entity } from 'typeorm'
import { InternalServerErrorException } from '@nestjs/common'
import { IsEmail, IsEnum } from 'class-validator'

enum UserRole {
    Client,
    Owner,
    Delivery,
}

registerEnumType(UserRole, { name: 'UserRole' })

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class User extends CoreEntity {
    @Column()
    @Field(() => String)
    @IsEmail()
    email: string

    @Column()
    @Field(() => String)
    password: string

    @Column({ type: 'enum', enum: UserRole })
    @Field(() => UserRole)
    @IsEnum(UserRole)
    role: UserRole

    @BeforeInsert()
    async hashPassword(): Promise<void> {
        try {
            this.password = await bcrypt.hash(this.password, 12)
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }

    async checkPassword(aPassword: string): Promise<boolean> {
        try {
            const statusCompare: boolean = await bcrypt.compare(aPassword, this.password)
            return statusCompare
        } catch (error) {
            console.log(error)
            throw new InternalServerErrorException()
        }
    }
}