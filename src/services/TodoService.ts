

import { CronJob } from 'cron';
import { Service } from 'typedi';
import { IsNull, Not } from 'typeorm';
import { TodoRepository, UserRepository } from '../db/repositories';


const USER_CHARACTER_HP_DAMAGE_RATE = 5;
const USER_SCORE_DECREASE_RATE = 5;
const USER_PERFECT_DAY_SCORE = 50;


@Service()
export class TodoService {
    private cronJob: CronJob;

    public constructor(
        private readonly userRepository: UserRepository,
        private readonly todoRepository: TodoRepository
    ) {
        this.cronJob = new CronJob(
            '0 0 4 * * *',
            async () => {
                await this.dayUpdate();
            },
            null,
            true,
            'Asia/Seoul'
        );

        this.cronJob.start();
    }

    public async dayUpdateImmediately() {
        await this.dayUpdate();
    }

    private async dayUpdate() {
        const users = await this.userRepository.find({ where: { id: Not(IsNull()) }});
        for(const user of users) {
            const character = await user.character;

            let failureCount = 0;
            let hp = character.hp;
            const todos = await this.todoRepository.find({ where: { user: { id: user.id } } });
            for(const todo of todos) {
                if(todo.completed) {
                    await todo.remove();
                } else {
                    hp -= todo.priority * USER_CHARACTER_HP_DAMAGE_RATE;
                    failureCount++;
                }
            }
            character.hp = Math.max(hp, 0);
            await character.save();


            let score = user.score;
            score -= failureCount * USER_SCORE_DECREASE_RATE;

            // if perfect day
            if(todos.length !== 0 && failureCount === 0) {
                score += USER_PERFECT_DAY_SCORE;
            }

            user.score = Math.max(score, 0);

            await user.save();
        }
    }
}