import { Arg, Query, Resolver } from "type-graphql";
import { Service } from "typedi";
import { UserRepository } from "../../db/repositories";
import { User } from "../../entities/User";



@Service()
@Resolver()
export default class RankingResolver {
    constructor(
        private readonly userRepository: UserRepository
    ) {}

    @Query(() => [User])
    async rankings(
        @Arg('skip') skip: number,
        @Arg('limit') limit: number
    ) {
        const users = await this.userRepository.find({
            skip,
            take: limit,
            order: {
                score: "DESC"
            }
        });
        
        return users;
    }
}