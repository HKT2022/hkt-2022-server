import { assignPartial } from "@lunuy/assign-partial";
import { ApolloError } from "apollo-server-core";
import { Arg, Authorized, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";
import { Service } from "typedi";
import { TodoRepository, UserRepository } from "../../db/repositories";
import { Todo, TodoInput, TodoUpdate } from "../../entities/Todo";
import { ApolloContext } from "../apolloServer";


@Service()
@Resolver()
export class TodoResolver {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly todoRepository: TodoRepository
    ) {}

    @Authorized()
    @Query(() => [Todo])
    async myTodos(
        @Ctx() ctx: ApolloContext
    ) {
        const todos = await this.todoRepository.find({
            where: {
                user: {
                    id: ctx.userToken!.id
                }
            }
        });

        return todos;
    }

    @Authorized()
    @Mutation(() => Todo)
    async createTodo(
        @Ctx() ctx: ApolloContext,
        @Arg("todo") todo: TodoInput
    ) {
        const user = (await this.userRepository.findOne({ where: { id: ctx.userToken!.id } }))!;

        const newTodo = await this.todoRepository.create({
            priority: todo.priority,
            content: todo.content
        });
        newTodo.user = Promise.resolve(user);
        newTodo.completed = false;

        await newTodo.save();

        return newTodo;
    }

    @Authorized()
    @Mutation(() => Todo)
    async updateTodo(
        @Ctx() ctx: ApolloContext,
        @Arg("id", () => Int) id: number,
        @Arg("todo", () => TodoUpdate) todoUpdate: TodoUpdate
    ) {
        const todo = await this.todoRepository.findOne({ where: { id } });
        if (!todo) {
            throw new ApolloError("Todo not found");
        }

        if((await todo.user).id !== ctx.userToken!.id) {
            throw new ApolloError("You are not allowed to update this todo");
        }

        assignPartial(todo, todoUpdate, ["content", "priority", "completed"]);
        await todo.save();

        return todo;
    }

    @Authorized()
    @Mutation(() => Todo)
    async completeTodo(
        @Ctx() ctx: ApolloContext,
        @Arg("id", () => Int) id: number
    ) {
        const todo = await this.todoRepository.findOne({ where: { id } });
        if (!todo) {
            throw new ApolloError("Todo not found");
        }
        
        if((await todo.user).id !== ctx.userToken!.id) {
            throw new ApolloError("You are not allowed to complete this todo");
        }

        todo.completed = true;
        await todo.save();

        return todo;
    }

    @Authorized()
    @Mutation(() => Int)
    async removeTodo(
        @Ctx() ctx: ApolloContext,
        @Arg("id", () => Int) id: number
    ) {
        const todo = await this.todoRepository.findOne({ where: { id } });
        if (!todo) {
            throw new ApolloError("Todo not found");
        }

        if((await todo.user).id !== ctx.userToken!.id) {
            throw new ApolloError("You are not allowed to remove this todo");
        }

        await todo.remove();

        return id;
    }
}