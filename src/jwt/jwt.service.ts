//import { ConfigService } from '@nestjs/config'
import * as jwt from 'jsonwebtoken'
import { Inject, Injectable } from '@nestjs/common'
import { JwtModuleOptions } from './jwt.interfaces'
import { CONFIG_OPTIONS } from 'src/common/common.constants'

@Injectable()
export class JwtService {
    constructor(@Inject(CONFIG_OPTIONS) private readonly options: JwtModuleOptions) {}
    //private readonly config: ConfigService // We  can use this  to configure

    sign(payload: object): string {
        return jwt.sign(payload, this.options.privateKey)
        //return jwt.sign(payload, this.config.get('PRIVATE_KEY')) // If use config service
    }
    verify(token: string) {
        return jwt.verify(token, this.options.privateKey)
    }
}
