import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
//import { JwtMiddleware } from './jwt/jwt.middleware'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    app.useGlobalPipes(new ValidationPipe())
    //app.use(JwtMiddleware) // or use on app.module
    await app.listen(8080)
}
bootstrap()
