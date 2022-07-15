import { Field, InputType, Int, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Todo } from "./Todo";
import { TodoGroupUser } from "./TodoGroupUser";
import { User } from "./User";


@ObjectType()
@Entity('todo_group')
export class TodoGroup extends BaseEntity {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column()
    name!: string;

    @Field(() => User)
    @ManyToMany(() => User)
    owner!: Promise<User>;

    @Field()
    @Column()
    description!: string;

    @Field(() => [TodoGroupUser])
    @OneToMany(() => TodoGroupUser, todoGroupUser => todoGroupUser.todoGroup)
    todoGroupUsers!: Promise<TodoGroupUser[]>;
}

@InputType()
export class TodoGroupInput {
    @Field()
    name!: string;

    @Field()
    description!: string;
}

@InputType()
export class TodoGroupUpdate {
    @Field()
    name!: string;

    @Field()
    description!: string;
}