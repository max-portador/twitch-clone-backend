import * as React from 'react';

import { Body, Head, Heading, Link, Preview, Section, Tailwind, Text } from '@react-email/components';

import { Html } from '@react-email/html';

interface VerificationTemplateProps {
    domain: string;
    token: string;
    supportEmail: string
}

export function VerificationTemplate({
    domain,
    token,
    supportEmail
}: VerificationTemplateProps) {
    const verificationLink = `${domain}/account/verify?token=${token}`;

    return (<Html>
       <Head/>
       <Preview>Account verification</Preview>
       <Tailwind>
        <Body className='max-w-2xl mx-auto p-6 bg-slate-50'>
           <Section className='text-center mb-8'>
            <Heading className='text-3xl text-black font-bold'>
                Email verification
            </Heading>
            <Text className='text-base text-black'>
                Thank you for registering with Roga & Kopyuta!
                Please follow the link below to verify your email:
            </Text>
            <Link href={verificationLink} className="inline-flex justify-center items-center rounded-full text-sm font-medium text-white bg-[#18B9AE] px-5 py-2">
                Verify email
            </Link>
           </Section>
           <Section className='text-center mt-8'>
            <Text className='text-gray-600'>
            If you have any questions or encounter any difficulties,
            please don’t hesitate to contact our support team at{' '}
            </Text>
           <Link href={`mailto:${supportEmail}`} className="text-[#18B9AE] underline">
                {supportEmail}
            </Link>
            </Section>

        </Body>
       </Tailwind>
    </Html>)
}
