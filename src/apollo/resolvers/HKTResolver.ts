import { Mutation } from "type-graphql";
import { Service } from "typedi";
import { TodoService } from "../../services/TodoService";

@Service()
export class HKTResolver {
    constructor(
        private readonly todoService: TodoService
    ) {}

    @Mutation(() => Boolean)
    async HKTDayUpdateImmediately() {
        await this.todoService.dayUpdateImmediately();
        return true;
    }
}