
import { IsAlphanumeric, Length, Matches, IsEmail } from 'class-validator';
import { ObjectType, Field, InputType } from 'type-graphql';
import { Entity, Column, BaseEntity, PrimaryColumn, OneToMany, TableInheritance, PrimaryGeneratedColumn, ChildEntity, CreateDateColumn } from 'typeorm';


@ObjectType()
@Entity('user')
@TableInheritance({ column: { type: "varchar", name: "type" } })
export class User extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Field()
    @Column()
    username!: string;

    @Field()
    @CreateDateColumn()
    createdAt!: Date;
}

@ObjectType()
@ChildEntity()
export class LocalUser extends User {
    @Field()
    @Column()
    email!: string;

    @Column()
    password!: string;
}

@ObjectType()
@ChildEntity()
export class GoogleUser extends User {
    @Field()
    @Column()
    sub!: string;
}

@InputType()
export class LocalUserInput {
    @Field()
    @Length(1, 30)
    password!: string;

    @Field()
    @Length(1, 30)
    username!: string;

    @Field()
    emailToken!: string
}

@InputType()
export class UserUpdate {
    @Field()
    @Length(1, 30)
    username!: string;
}