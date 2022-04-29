import * as bcrypt from 'bcrypt'
import { Field, InputType, ObjectType, registerEnumType } from '@nestjs/graphql'
import { CoreEntity } from 'src/common/entities/core.entity'
import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm'
import { InternalServerErrorException } from '@nestjs/common'
import { IsEmail, IsEnum, IsString } from 'class-validator'

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

    @Column({ select: false })
    @Field(() => String)
    @IsString()
    password: string

    @Column({ type: 'enum', enum: UserRole })
    @Field(() => UserRole)
    @IsEnum(UserRole)
    role: UserRole

    @Column({ default: false })
    @Field(() => Boolean)
    verified: boolean

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword(): Promise<void> {
        if (this.password) {
            try {
                this.password = await bcrypt.hash(this.password, 12)
            } catch (error) {
                console.log(error)
                throw new InternalServerErrorException()
            }
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
