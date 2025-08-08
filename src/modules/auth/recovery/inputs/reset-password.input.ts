import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ResetPasswordInput {
	@Field()
	@IsString()
	@IsNotEmpty()
	@IsEmail()
	public email: string;
}
