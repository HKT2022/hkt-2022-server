import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TodoGroup } from "./TodoGroup";
import { User } from "./User";



@ObjectType()
@Entity('todo_group_user')
export class TodoGroupUser extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    id!: number;

    @Field(() => TodoGroup)
    @ManyToOne(() => TodoGroup)
    todoGroup!: Promise<TodoGroup>;

    @Field(() => User)
    @ManyToOne(() => User)
    user!: Promise<User>;
}