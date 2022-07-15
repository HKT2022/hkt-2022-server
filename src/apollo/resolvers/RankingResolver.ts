import { ApolloError } from "apollo-server-core";
import { Arg, Int, Query, Resolver } from "type-graphql";
import { Service } from "typedi";
import { LessThan } from "typeorm";
import { UserRepository } from "../../db/repositories";
import { User } from "../../entities/User";



@Service()
@Resolver()
export default class RankingResolver {
    constructor(
        private readonly userRepository: UserRepository
    ) {}

    @Query(() => [User])
    async totalRankings(
        @Arg('skip', () => Int) skip: number,
        @Arg('limit', () => Int) limit: number
    ) {
        if(skip < 0) throw new ApolloError('skip must be greater than or equal to 0');
        if(limit < 0) throw new ApolloError('limit must be greater than or equal to 0');
        if(limit > 100) throw new ApolloError('limit must be less than or equal to 100');

        // const users = await this.userRepository.find({
        //     skip,
        //     take: limit,
        //     order: {
        //         score: "DESC"
        //     }
        // });

        const result = await this.userRepository.createQueryBuilder('user')
            .select('user.id')
            .addSelect('user.score')
            .addSelect('user.username')
            .addSelect('user.createdAt')
            .orderBy('user.score', 'DESC')
            .skip(skip)
            .take(limit)
            .getMany();

        return result;
    }

    @Query(() => [User])
    async totalRankingsWithUser(
        @Arg('userId', () => String, { nullable: true }) userId: string | null,
        @Arg('limit', () => Int) limit: number
    ) {
        if(userId === null) {
            return await this.totalRankings(0, limit);
        } else {
            const user = await this.userRepository.findOne({ where: { id: userId } });

            if(!user) throw new Error('User not found');
    
            const users = await this.userRepository.find({
                where: {
                    score: LessThan(user.score)
                },
                order: {
                    score: "DESC"
                },
                take: limit
            });
    
            return users;
        }
    }
}