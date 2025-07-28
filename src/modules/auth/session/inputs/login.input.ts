import { IsNotEmpty, IsString, MinLength } from 'class-validator';

import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class LoginInput {
	@Field()
	@IsString()
	@IsNotEmpty()
	public login: string;

	@Field()
	@IsString()
	@IsNotEmpty()
	@MinLength(8)
	public password: string;
}
