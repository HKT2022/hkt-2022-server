import { Field, Int, ObjectType } from "type-graphql";


@ObjectType()
export class UserRanking {
    @Field(() => Int)
    totalRanking!: number;
}