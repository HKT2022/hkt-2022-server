import { ApolloError } from "apollo-server-koa";
import { Arg, Ctx, Int, Mutation, Resolver } from "type-graphql";
import { TodoGroupRepository, TodoGroupUserRepository, UserRepository } from "../../db/repositories";
import { TodoGroup } from "../../entities/TodoGroup";
import { ApolloContext } from "../apolloServer";


@Resolver()
export class TodoGroupUserResolver {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly todoGroupRepository: TodoGroupRepository,
        private readonly todoGroupUserRepository: TodoGroupUserRepository
    ) {}
    
    @Mutation(() => TodoGroup)
    async registerGroup(
        @Arg("id", () => Int) id: number,
        @Ctx() ctx: ApolloContext
    ) {
        const user = (await this.userRepository.findOne({ where: { id: ctx.userToken!.id } }))!;

        const todoGroup = await this.todoGroupRepository.findOne({ where: { id } });
        if (!todoGroup) {
            throw new ApolloError("Group not found");
        }

        // if todoGroupUser already exists, do nothing
        const todoGroupUserCount = await this.todoGroupUserRepository.count({ where: { user: { id: user.id }, todoGroup: { id: todoGroup. id } } });
        if (todoGroupUserCount !== 0) {
            throw new ApolloError("You are already registered to this group");
        }

        const todoGroupUser = this.todoGroupUserRepository.create();
        todoGroupUser.todoGroup = Promise.resolve(todoGroup);
        todoGroupUser.user = Promise.resolve(user);
        await todoGroupUser.save();

        return todoGroup;
    }
}