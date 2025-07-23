import { CreatePrismaDto } from './create-prisma.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdatePrismaDto extends PartialType(CreatePrismaDto) {}
