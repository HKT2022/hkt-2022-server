
import { IsAlphanumeric, Length, Matches, IsEmail } from 'class-validator';
import { ObjectType, Field, InputType, Int } from 'type-graphql';
import { Entity, Column, BaseEntity, PrimaryColumn, OneToMany, TableInheritance, PrimaryGeneratedColumn, ChildEntity, CreateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { Todo } from './Todo';
import { TodoGroup } from './TodoGroup';
import { UserCharacter } from './UserCharacter';


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

    @Field(() => Int)
    @Column({ default: 0 })
    deathCount!: number;

    @Field()
    @Column({ default: 0 })
    score!: number;

    @Field(() => UserCharacter)
    @OneToOne(() => UserCharacter, userCharacter => userCharacter.user)
    @JoinColumn()
    character!: Promise<UserCharacter>;

    // @Field(() => TodoGroup)
    // todoGroup!: Promise<TodoGroup>;

    // @Field(() => [Todo])
    @OneToMany(() => Todo, todo => todo.user)
    todos!: Promise<Todo[]>;
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