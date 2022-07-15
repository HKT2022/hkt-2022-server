import { ApolloError } from "apollo-server-koa";
import { Authorized, Ctx, Mutation, Resolver } from "type-graphql";
import { Service } from "typedi";
import { USER_CHARACTER_MAX_HP } from "../../const";
import { UserCharacterRepository } from "../../db/repositories";
import { UserCharacter } from "../../entities/UserCharacter";
import { ApolloContext } from "../apolloServer";


@Resolver()
@Service()
export class UserCharacterResolver {
    constructor(
        private readonly userCharacterRepository: UserCharacterRepository
    ) {}

    @Authorized()
    @Mutation(() => UserCharacter)
    async reviveMyUserCharacter(
        @Ctx() ctx: ApolloContext
    ) {
        const userCharacter = (await this.userCharacterRepository.findOne({ where: { user: { id: ctx.userToken!.id } } }))!;
        
        if(userCharacter.hp !== 0)
            throw new ApolloError('Why? User character is not dead yet!');
        
        userCharacter.hp = USER_CHARACTER_MAX_HP;
        await userCharacter.save();

        return userCharacter;
    }
}