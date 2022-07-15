import { IsNull, Not } from "typeorm";
import { User } from "../entities/User";
import { UserCharacter } from "../entities/UserCharacter";


export async function migrate() {
    const users = await User.find({ where: { id: Not(IsNull()) }});
    for(const user of users) {
        if(await UserCharacter.count({ where: { user: { id: user.id } } }) === 0) {
            const userCharacter = new UserCharacter();
            await userCharacter.save();

            user.character = Promise.resolve(userCharacter);
            await user.save();
        }
    }
}