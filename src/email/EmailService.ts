
import nodemailer from 'nodemailer';
import ejs from 'ejs';
import fs from 'fs';
import path from 'path';


const emailCheckEmailTemplate = fs.readFileSync(path.resolve(__dirname, '../assets/email-templates/email-check.ejs'), 'utf-8');
const emailChangeEmailTemplate = fs.readFileSync(path.resolve(__dirname, '../assets/email-templates/email-change.ejs'), 'utf-8');
const passwordResetEmailTemplate = fs.readFileSync(path.resolve(__dirname, '../assets/email-templates/password-reset.ejs'), 'utf-8');

export class EmailService {
    constructor(private readonly transporter: nodemailer.Transporter) {}
    
    async sendEmail({ subject, html, text }: { subject: string, html: string, text: string }, to: string) {
        return await this.transporter.sendMail({
            from: '"SVC" <svc@svcsvc.com>',
            to,
            subject,
            text,
            html
        })
    }

    async sendEmailCheckEmail(verifyId: string, to: string) {
        await this.sendEmail({
            subject: 'Email check',
            text: 'Email check',
            html: ejs.render(emailCheckEmailTemplate, { verifyId })
        }, to);
    }
    async sendEmailChangeEmail(verifyId: string, to: string) {
        await this.sendEmail({
            subject: 'Email change',
            text: 'Email check',
            html: ejs.render(emailChangeEmailTemplate, { verifyId })
        }, to);
    }
    async sendAccountFindEmail(verifyId: string, to: string) {
        await this.sendEmail({
            subject: 'Email change',
            text: 'Email check',
            html: ejs.render(passwordResetEmailTemplate, { verifyId })
        }, to);
    }
}
