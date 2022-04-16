import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { IsBoolean, IsOptional, IsString, Length } from 'class-validator'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@InputType({ isAbstract: true }) // For Extending
@ObjectType()
@Entity()
export class Restaurant {
    @PrimaryGeneratedColumn()
    @Field(() => Number)
    id: number

    @Column()
    @Field(() => String)
    @IsString()
    @Length(3)
    name: string

    @Field(() => Boolean, { nullable: true, defaultValue: false }) //For GraphQL
    @Column({ default: false }) // For database
    @IsOptional() // For validation
    @IsBoolean() // For validation
    isVegan: boolean

    @Field(() => String)
    @Column()
    @IsString()
    address: string
}
