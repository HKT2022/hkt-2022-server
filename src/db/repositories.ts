import { ContainerInstance } from "typedi";
import { DataSource, Repository } from "typeorm";
import { EmailCheck } from "../entities/EmailCheck";
import { GoogleUser, LocalUser, User } from "../entities/User";


// Repository<T> 타입으로는 DI를 사용할 수 없으므로, 각각의 T에 대한 Repository class를 만들어 DI가 가능하도록 한다.
// 각각의 Repository class는 일반 Repository와 정확히 똑같은 일을 할 수 있기 때문에, 실제로 사용되지 않으며,
// Repository를 주입받는 쪽에서 Repository<T> 타입의 T를 식별하는 데에만 사용된다.
// Entity로 T를 알 수 있다.

export class UserRepository extends Repository<User> {
    static Entity = User;
}
export class LocalUserRepository extends Repository<LocalUser> {
    static Entity = LocalUser;
}
export class GoogleUserRepository extends Repository<GoogleUser> {
    static Entity = GoogleUser;
}
export class EmailCheckRepository extends Repository<EmailCheck> {
    static Entity = EmailCheck;
}

export const repositories = [UserRepository, LocalUserRepository, GoogleUserRepository, EmailCheckRepository];


export function addRepositories(containerInstance: ContainerInstance, dataSource: DataSource) {
    for(const repositoryClazz of repositories) {
        containerInstance.set(repositoryClazz, dataSource.getRepository(repositoryClazz.Entity));
    }

    return containerInstance;
}