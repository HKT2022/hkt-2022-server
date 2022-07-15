import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { USER_CHARACTER_MAX_HP } from "../const";
import { User } from "./User";


@ObjectType()
@Entity('user_character')
export class UserCharacter extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    id!: number;

    @Field(() => User)
    @OneToOne(() => User, user => user.character)
    user!: Promise<User>;
    
    @Field()
    @CreateDateColumn()
    createdAt!: Date;

    @Field()
    @Column({ default: USER_CHARACTER_MAX_HP })
    hp!: number;
}