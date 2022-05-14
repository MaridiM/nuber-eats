//import axios from 'axios'
import Mailgun from 'mailgun.js'
import * as FormData from 'form-data'
import { Inject, Injectable } from '@nestjs/common'
import { CONFIG_OPTIONS } from 'src/common/common.constants'
import { MailModuleOptions, MailParams } from './email.interfaces'

@Injectable()
export class MailService {
    constructor(@Inject(CONFIG_OPTIONS) private readonly options: MailModuleOptions) {}

    private async sendMail(subject: string, template: string, to: string[], mailParams: MailParams) {
        const mailgun = new Mailgun(FormData)
        const mg = mailgun.client({
            username: 'api',
            key: this.options.apiKey || '3767928e4616e4c9b9cbc7c541cdcad9-53ce4923-e154ea70',
        })
        await mg.messages.create(this.options.domain, {
            from: `NUber Eats <mailgun@${this.options.domain}>`,
            to: [...to],
            subject,
            //text: content,
            template,
            'v:code': mailParams.code,
            'v:username': mailParams.username,
        })
    }

    sendVerificationEmail(email: string, code: string) {
        this.sendMail('Verify Your Email', 'confirm-email-address', ['maridim.dev@gmail.com'], {
            code: code,
            username: email,
        })
    }
}
