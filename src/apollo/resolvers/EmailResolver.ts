
import { Mutation, Query, Arg } from 'type-graphql';
import { EmailCheck } from '../../entities/EmailCheck';
import { EMAIL_VERIFY_TIMEOUT } from '../../const';
import { ApolloError } from 'apollo-server-errors';
import { getEmailJwt, getEmailToken } from '../../auth/emailToken';
import { nanoid } from 'nanoid';
import { Service } from 'typedi';
import { EmailService } from '../../email/EmailService';
import { EmailCheckRepository } from '../../db/repositories';

@Service()
export default class EmailResolver {
    constructor(
        private readonly emailService: EmailService,
        private readonly emailCheckRepository: EmailCheckRepository
    ) {}

    @Mutation(() => EmailCheck)
    async requestEmailCheck(
        @Arg('email') email: string
    ) {
        const verifyId = nanoid(10);
        
        try {
            await this.emailService.sendEmailCheckEmail(verifyId, email);
        } catch(e) {
            console.log(e);
            throw new ApolloError('Failed to send email');
        }

        const emailCheck = new EmailCheck();
        emailCheck.verifyId = verifyId;
        emailCheck.email = email;
        emailCheck.verified = false;
        await emailCheck.save();

        setTimeout(async () => {
            await emailCheck.remove();
        }, EMAIL_VERIFY_TIMEOUT);

        return emailCheck;
    }
    @Mutation(() => String)
    async verifyEmail(
        @Arg('verifyId') verifyId: string
    ) {
        const emailCheck = await this.emailCheckRepository.findOne({ where: { verifyId } });
        if(!emailCheck)
            throw new ApolloError('Invalid verifyId');
            
        emailCheck.verified = true;
        await emailCheck.save();
    }
    @Mutation(() => String)
    async issueEmailToken(
        @Arg('emailCheckId') emailCheckId: string
    ) {
        const emailCheck = await this.emailCheckRepository.findOne({ where: { id: emailCheckId } });
        if(!emailCheck)
            throw new ApolloError('wrong emailCheckId');
        if(!emailCheck.verified)
            throw new ApolloError('Email not verified yet');
        
        const email = emailCheck.email;
        const emailJWT = getEmailJwt(email);

        await emailCheck.remove();
        
        return emailJWT;
    }
}