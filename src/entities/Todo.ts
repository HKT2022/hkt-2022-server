import { Field, InputType, Int, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TodoGroup } from "./TodoGroup";
import { User } from "./User";


@ObjectType()
@Entity('todo')
export class Todo extends BaseEntity {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id!: number;

    @Field(() => Int)
    @Column()
    priority!: number;

    @Field()
    @Column()
    content!: string;

    @Field()
    @Column()
    completed!: boolean;

    @Field()
    @CreateDateColumn()
    createdAt!: Date;

    @Field(() => User)
    @ManyToOne(() => User)
    user!: Promise<User>;
}

@InputType()
export class TodoInput {
    @Field()
    content!: string;

    @Field(() => Int)
    priority!: number;
}

@InputType()
export class TodoUpdate {
    @Field()
    content!: string;

    @Field(() => Int)
    priority!: number;

    @Field()
    completed!: boolean;
}