import { ApolloServerPluginLandingPageGraphQLPlayground, ApolloServerPluginLandingPageDisabled } from 'apollo-server-core';
import { AuthChecker, buildSchema, ContainerType, PubSubEngine } from "type-graphql";
import { ApolloServer, ExpressContext } from 'apollo-server-express';
import { getUserAccessToken, UserAccessToken } from "../auth/userToken";
import { Context } from 'graphql-ws';
import { Extra, useServer } from 'graphql-ws/lib/use/ws';
import { GraphQLSchema } from 'graphql';
import { WebSocketServer } from 'ws';
import http from 'http';
import UserResolver from './resolvers/UserResolver';
import { DataSource, Entity } from 'typeorm';
import { User } from '../entities/User';
import { ContainerInstance } from 'typedi';
import { repositories } from '../db/repositories';
import EmailResolver from './resolvers/EmailResolver';
import { TodoResolver } from './resolvers/TodoResolver';
import { HKTResolver } from './resolvers/HKTResolver';
import { UserCharacterResolver } from './resolvers/UserCharacterResolver';
import RankingResolver from './resolvers/RankingResolver';
import DayUpdateResolver from './resolvers/DayUpdateResolver';


export interface ApolloContext {
    userToken?: UserAccessToken;
    socket?: WebSocket;
}

const authChecker: AuthChecker<ApolloContext> = async (
    { root, args, context, info },
    roles
) => {
    const { userToken } = context;

    const loggedIn = (
        userToken !== undefined
    );

    if(!loggedIn)
        return false;
    
    return roles.every(role => {
        return false;
    });
};

function httpContext({ req }: ExpressContext): ApolloContext {

    const token = req.headers.authorization || '';

    try {
        const userToken = getUserAccessToken(token);
        return { userToken };
    } catch(e) {
        return {};
    }
};

function webSocketContext(ctx: Context<Extra & Partial<Record<PropertyKey, never>>>): ApolloContext {
    const token = ctx.connectionParams?.Authorization as (undefined | string) || '';

    try {
        const userToken = getUserAccessToken(token);
        return { userToken, socket: (ctx.extra as any).socket };
    } catch(e) {
        return { socket: (ctx.extra as any).socket };
    }
}

export async function getSchema(pubSub: PubSubEngine, container: ContainerType) {
    return await buildSchema({
        resolvers: [
            UserResolver,
            EmailResolver,
            TodoResolver,
            HKTResolver,
            UserCharacterResolver,
            RankingResolver,
            DayUpdateResolver
        ],
        authChecker,
        container,
        pubSub
    });
}

export async function getApolloServer(schema: GraphQLSchema, isDevelopment: boolean) {
    const apolloServer = new ApolloServer({
        schema,
        plugins: [
            isDevelopment ? 
                ApolloServerPluginLandingPageGraphQLPlayground()
            :
                ApolloServerPluginLandingPageDisabled()
        ],
        context: httpContext
    });

    return apolloServer;
}


export async function applyWebSocketServer(schema: GraphQLSchema, server: http.Server) {
    const onDisconnect = (ctx: Context<Extra & Partial<Record<PropertyKey, never>>>, code: number, reason: string) => {
        const token = ctx.connectionParams?.Authorization as (undefined | string) || '';
    };

    const wsServer = new WebSocketServer({
        server,
        path: '/graphql',
    });
    
    useServer({ schema, context: webSocketContext, onDisconnect }, wsServer);

    return wsServer;
}