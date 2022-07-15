

import { CronJob } from 'cron';
import { Service } from 'typedi';
import { IsNull, Not } from 'typeorm';
import { TodoRepository, UserRepository } from '../db/repositories';
import { PubSubService } from './PubSubService';
import { TOPIC_USER_CHARACTER_STATE } from '../apollo/resolvers/UserCharacterResolver';
import { UserCharacterState } from '../apollo/types/UserCharacterState';
import { TOPIC_DAY_UPDATE } from '../apollo/resolvers/DayUpdateResolver';


const USER_CHARACTER_HP_DAMAGE_RATE = 5;
const USER_SCORE_DECREASE_RATE = 5;
const USER_PERFECT_DAY_SCORE = 20;


@Service()
export class TodoService {
    private cronJob: CronJob;

    public constructor(
        private readonly userRepository: UserRepository,
        private readonly todoRepository: TodoRepository,
        private readonly pubSub: PubSubService
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
            const lastHp = character.hp;
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

            // if user is dead, user dead count is increased
            if(lastHp !== 0 && character.hp === 0)
                user.deathCount = user.deathCount + 1;
            
            
            let score = user.score;
            score -= failureCount * USER_SCORE_DECREASE_RATE;

            // if perfect day
            if(todos.length !== 0 && failureCount === 0) {
                score += USER_PERFECT_DAY_SCORE;
                character.hp = Math.min(100, character.hp + 10);
                await character.save();
            }

            user.score = Math.max(score, 0);
            await user.save();

            
            // character event
            await this.pubSub.publish(TOPIC_USER_CHARACTER_STATE(character.id), { hp: character.hp } as UserCharacterState);
        }

        await this.pubSub.publish(TOPIC_DAY_UPDATE, undefined);
    }
}