import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { ExpressRequest } from '@/src/shared/types';
import { MailService } from '../../../libs/mail/mail.service';
import { PrismaService } from '../../../core/prisma/prisma.service';
import { TokenType } from '@prisma/generated';
import { VerificationInput } from './inputs/verification.input';
import { getSessionMetadata } from '@/src/shared/utils/session-metadata.utils';
import { saveSession } from '@/src/shared/utils/session.util';

@Injectable()
export class VerificationService {
    public constructor(private readonly prismaService: PrismaService, private readonly mailService: MailService){}

    public async verify(req: ExpressRequest, input: VerificationInput, userAgent: string) {

        const {token} = input

        const existingToken = await this.prismaService.token.findUnique({
            where: {
                token,
                type: TokenType.EMAIL_VERIFY
            }
        })

        if (!existingToken){
            throw new NotFoundException('Токен не найден')
        }

        const hasExpired = new Date(existingToken.expiresIn) < new Date()

        if (hasExpired){
            throw new BadRequestException('Токен истек')
        }

         if (!existingToken.userId){
            throw new BadRequestException('Невалидный токен без userId')
        }

        const user = await this.prismaService.user.update({
            where: {
                id: existingToken.userId
            },
            data: {
                isEmailVerified: true
            }
        })

        await this.prismaService.token.delete({
            where: {
                id: existingToken.id,
                type: TokenType.EMAIL_VERIFY
            }
        })

        const metadata = getSessionMetadata(req, userAgent);
        
        return await saveSession(req, user, metadata)
    }
}
