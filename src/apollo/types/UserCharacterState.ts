import { Max, Min } from "class-validator";
import { Field, InputType, Int, ObjectType } from "type-graphql";

@ObjectType()
export class UserCharacterStateNotification {
    @Field()
    hp!: number;
}

export interface UserCharacterState {
    hp: number;
}