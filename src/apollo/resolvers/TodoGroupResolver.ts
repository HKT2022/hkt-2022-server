import { assignPartial } from "@lunuy/assign-partial";
import { Arg, Ctx, Int, Mutation, Query } from "type-graphql";
import { Service } from "typedi";
import { TodoGroupRepository, UserRepository } from "../../db/repositories";
import { TodoGroup, TodoGroupInput, TodoGroupUpdate } from "../../entities/TodoGroup";
import { ApolloContext } from "../apolloServer";


@Service()
export default class TodoGroupResolver {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly todoGroupRepository: TodoGroupRepository
    ) {}

    @Query(() => [])
    async Group(
        @Arg("id", () => Int) id: number
    ) {
        return this.todoGroupRepository.findOne({ where: { id } });
    }

    @Mutation(() => TodoGroup)
    async createGroup(
        @Arg("todoGroup") todoGroupInput: TodoGroupInput,
        @Ctx() ctx: ApolloContext
    ) {
        const user = (await this.userRepository.findOne({ where: { id: ctx.userToken!.id } }))!;

        const todoGroup = this.todoGroupRepository.create();
        assignPartial(todoGroup, todoGroupInput, ["name", "description"]);
        todoGroup.owner = Promise.resolve(user);
        await todoGroup.save();

        return todoGroup;
    }

    @Mutation(() => TodoGroup)
    async updateGroup(
        @Arg("id", () => Int) id: number,
        @Arg("todoGroup") todoGroupUpdate: TodoGroupUpdate,
        @Ctx() ctx: ApolloContext
    ) {
        const user = (await this.userRepository.findOne({ where: { id: ctx.userToken!.id } }))!;

        const todoGroup = await this.todoGroupRepository.findOne({ where: { id } });
        if (!todoGroup) {
            throw new Error("Group not found");
        }
        if ((await todoGroup.owner).id !== user.id) {
            throw new Error("You are not the owner of this group");
        }

        assignPartial(todoGroup, todoGroupUpdate, ["name", "description"]);
        await todoGroup.save();

        return todoGroup;
    }
}