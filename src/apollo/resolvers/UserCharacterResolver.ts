import { ApolloError } from "apollo-server-koa";
import { Arg, Authorized, Ctx, Int, Mutation, PubSub, PubSubEngine, Resolver, Root, Subscription } from "type-graphql";
import { Service } from "typedi";
import { USER_CHARACTER_MAX_HP } from "../../const";
import { UserCharacterRepository } from "../../db/repositories";
import { UserCharacter } from "../../entities/UserCharacter";
import { ApolloContext } from "../apolloServer";
import { UserCharacterState, UserCharacterStateNotification } from "../types/UserCharacterState";


export const TOPIC_USER_CHARACTER_STATE = (userCharacterId: number) => `USER_CHARACTER_STATE|${userCharacterId}`;

@Resolver()
@Service()
export class UserCharacterResolver {
    constructor(
        private readonly userCharacterRepository: UserCharacterRepository
    ) {}

    @Authorized()
    @Mutation(() => UserCharacter)
    async reviveMyUserCharacter(
        @Ctx() ctx: ApolloContext,
        @PubSub() pubSub: PubSubEngine
    ) {
        const userCharacter = (await this.userCharacterRepository.findOne({ where: { user: { id: ctx.userToken!.id } } }))!;
        
        if(userCharacter.hp !== 0)
            throw new ApolloError('Why? User character is not dead yet!');
        
        userCharacter.hp = USER_CHARACTER_MAX_HP;
        await userCharacter.save();

        await pubSub.publish(TOPIC_USER_CHARACTER_STATE(userCharacter.id), { hp: userCharacter.hp } as UserCharacterState);

        return userCharacter;
    }
    
    @Subscription({
        topics: ({ args }) => TOPIC_USER_CHARACTER_STATE(args.userCharacterId)
    })
    userCharacterState(
        @Arg('userCharacterId', () => Int) userCharacterId: number,
        @Root() userCharacter: UserCharacterState
    ): UserCharacterStateNotification {
        if(userCharacter === undefined) {
            console.log("WTF");
            return { hp: 50 };
        }
        
        return {
            hp: userCharacter.hp
        };
    }
}