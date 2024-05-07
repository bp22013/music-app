import React from 'react';
import { Divider } from '@nextui-org/divider';
import { Link } from '@nextui-org/link';
import { Button } from '@nextui-org/react';
import { BsInstagram, BsTwitter } from 'react-icons/bs';

interface SnsLinkProps {
    href: string;
    startContent: React.ReactNode;
    text: string;
}

const SnsLinks: SnsLinkProps[] = [
    {
        href: 'https://twitter.com/aida_0710',
        startContent: <BsTwitter className='h-full w-full p-1' />,
        text: 'Twitter',
    },
    {
        href: 'https://www.instagram.com/aida_07100/',
        startContent: <BsInstagram className='h-full w-full p-1' />,
        text: 'Instagram',
    },
];

export default async function Footer(){
    return (
        <footer className='w-full'>
            <Divider className='my-14 mt-10' />
            <div className='m-5 items-center text-center'>
                <div className='mb-3'>
                    {SnsLinks.map((snsLink: SnsLinkProps, index: number) => (
                        <Link
                            key={index}
                            href={snsLink.href}>
                            <Button
                                startContent={snsLink.startContent}
                                className='mr-2'
                                variant='light'
                                color='default'>
                                {snsLink.text}
                            </Button>
                        </Link>
                    ))}
                </div>

                <Link
                    href='https://twitter.com/aida_0710'
                    isBlock
                    showAnchorIcon
                    className='mb-3 text-medium font-normal'>
                    <p>© 2024 AkagiCo. All Rights Reserved.</p>
                </Link>
            </div>
        </footer>
    );
}
