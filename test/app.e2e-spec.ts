import * as request from 'supertest'

import { Test, TestingModule } from '@nestjs/testing'

import { App } from 'supertest/types'
import { CoreModule } from '../src/core/core.module'
import { INestApplication } from '@nestjs/common'

describe('AppController (e2e)', () => {
	let app: INestApplication<App>

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [CoreModule]
		}).compile()

		app = moduleFixture.createNestApplication()
		await app.init()
	})

	it('/ (GET)', () => {
		return request(app.getHttpServer())
			.get('/')
			.expect(200)
			.expect('Hello World!')
	})
})
