import { AppModule } from '../src/app.module'
import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'

export default async (req: any, res: any) => {
  const app = await NestFactory.create(AppModule)

  app.enableCors({ origin: true, credentials: true })
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
  )

  await app.init()

  const instance = app.getHttpAdapter().getInstance() as (req: any, res: any) => void
  instance(req, res)
}
