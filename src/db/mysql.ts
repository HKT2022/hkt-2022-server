import { createConnection, DataSource } from "typeorm";
import { EmailCheck } from "../entities/EmailCheck";
import { GoogleUser, LocalUser, User } from "../entities/User";
import { MYSQL_ADDR, MYSQL_DATABASE, MYSQL_PASSWORD, MYSQL_PORT, MYSQL_USERNAME } from "../secret";

export async function getDataSource() {
    return new DataSource({
        type: 'mysql',
        host: MYSQL_ADDR,
        port: MYSQL_PORT,
        username: MYSQL_USERNAME,
        password: MYSQL_PASSWORD,
        database: MYSQL_DATABASE,
        synchronize: true,
        logging: true,
        entities: [User, LocalUser, GoogleUser, EmailCheck],
        subscribers: [],
        migrations: [],
    });
}