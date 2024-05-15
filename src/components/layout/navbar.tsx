'use client';

import React from 'react';
import { Link } from '@nextui-org/link';
import { Button, Navbar, NavbarBrand, NavbarContent, NavbarItem, useDisclosure } from '@nextui-org/react';
import { ProjectIcon } from '../icons/project-icons';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { PhoneMenu } from './phone-menu';
import { ModalProvider, useModal } from '@/utils/Providers/ModalProvider';
import { AppWindowIcon, HomeIcon } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useState, useEffect } from 'react';
import UserAvatar from '../icons/userAvatar';
import { BsBell, BsEnvelope, BsDoorOpen } from 'react-icons/bs';
import SignIn from './Modal/signinForm';
import SignUp from './Modal/signupForm';

export interface NavItemProps {
    Link: string;
    Display: string;
    Icon: React.ReactNode;
}

const Navigation = () => {

    const [session, setSession] = useState<any>();
    const supabase = createClientComponentClient();
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { openModal } = useModal();

    const MenuItems: NavItemProps[] = [
        {
            Display: 'ホーム',
            Link: "/",
            Icon: (
                <HomeIcon
                    size={32}
                    color='currentColor'
                    strokeWidth={3}
                />
            ),
        },
        {
            Display: 'アクティビティ',
            Link: "/activity",
            Icon: (
                <HomeIcon
                    size={32}
                    color='currentColor'
                    strokeWidth={3}
                />
            ),
        },
        {
            Display: 'サーチ',
            Link: "/serch",
            Icon: (
                <AppWindowIcon
                    size={32}
                    color='currentColor'
                    strokeWidth={3}
                />
            ),
        }
    ];

    const checkSession = async () => {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) {
            console.log(error);
        }

        setSession(session)

        const code = searchParams.get("code");
        if (code != null) {
            try {
                await supabase.auth.exchangeCodeForSession(code!!)
            } catch (error) {

            }

            const { data: { session }, error } = await supabase.auth.getSession()
            if (error) {
                console.log(error);
                return
            }

            setSession(session)

            router.push('/')
        } else {
            if (session == null && !pathname?.includes('/resetPassword')) {
                router.push('/');
            }
        }
    }

    useEffect(() => {
        checkSession()
    }, [])

    function isActive(link: string): boolean {
        return pathname === link;
    }

    return (
        <>
            <Navbar
                isBordered
                classNames={{
                    item: [
                        'flex',
                        'relative',
                        'h-full',
                        'items-center',
                        "data-[active=true]:after:content-['']",
                        'data-[active=true]:after:absolute',
                        'data-[active=true]:after:bottom-0',
                        'data-[active=true]:after:left-0',
                        'data-[active=true]:after:right-0',
                        'data-[active=true]:after:h-[2px]',
                        'data-[active=true]:after:rounded-[2px]',
                        'data-[active=true]:after:bg-primary',
                    ],
                }}>
                <NavbarContent>
                    <PhoneMenu NavItems={MenuItems} />
                    <NavbarBrand>
                        <Link
                            color='foreground'
                            href='/'>
                            <ProjectIcon />
                            <p className='ml-3 text-large font-bold text-inherit'>Profile</p>
                        </Link>
                    </NavbarBrand>
                </NavbarContent>
                <NavbarContent
                    className='hidden gap-4 sm:flex'
                    justify='center'>
                    {MenuItems.map((item: NavItemProps, index: number) => (
                        <NavbarItem
                            key={index}
                            isActive={isActive(item.Link)}>
                            <Link
                                color='foreground'
                                href={`${item.Link}`}>
                                {item.Display}
                            </Link>
                        </NavbarItem>
                    ))}
                </NavbarContent>
                <NavbarContent justify='end'>
                    
                    {session?.user ? (
                        <>
                            <NavbarItem>
                                <BsBell className='h-8 w-8' />
                            </NavbarItem>
                            <NavbarItem>
                                <BsEnvelope className='h-8 w-8 ml-2' />
                            </NavbarItem>
                            <NavbarItem className='ml-5'>
                                <UserAvatar session={session}/>
                            </NavbarItem>
                        </>
                    ) : (
                        <NavbarItem>
                            <Button color="primary" onClick={() => openModal(<SignIn />)}>ログイン</Button>
                            <Button color="primary" onClick={() => openModal(<SignUp />)}>新規登録</Button>
                        </NavbarItem>
                    )}
                </NavbarContent>
            </Navbar>
        </>
    );
}

export default Navigation;
