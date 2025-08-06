import { IsNotEmpty, IsUUID } from 'class-validator';

import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class VerificationInput {
	@Field(() => String)
	@IsUUID('4')
	@IsNotEmpty()
	public token: string;
}
