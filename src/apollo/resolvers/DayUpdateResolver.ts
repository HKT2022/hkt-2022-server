import { Resolver, Root, Subscription } from "type-graphql";
import { Service } from "typedi";
import { DayUpdateNotification } from "../types/DayUpdate";



export const TOPIC_DAY_UPDATE = 'DAY_UPDATE';

@Resolver()
@Service()
export default class DayUpdateResolver {
    constructor() {}

    @Subscription({
        topics: ({ args }) => TOPIC_DAY_UPDATE
    })
    dayUpdate(
        @Root() dayUpdate: undefined
    ): DayUpdateNotification {
        return true;
    }
}