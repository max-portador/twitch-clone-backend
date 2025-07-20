import { CoreModule } from './core/core.module'
import { NestFactory } from '@nestjs/core'

async function bootstrap() {
	const app = await NestFactory.create(CoreModule)
	await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
