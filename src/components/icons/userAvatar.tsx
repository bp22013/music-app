import React, { useState, useEffect } from "react";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Modal, ModalContent, ModalHeader, ModalFooter, Avatar, useDisclosure } from "@nextui-org/react";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const UserAvatar = () => {
    const [session, setSession] = useState<any>();
    const [avatarSrc, setAvatarSrc] = useState<string | undefined>();
    const supabase = createClientComponentClient();
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const checkSession = async () => {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.log(error);
        }
    
        setSession(session);
    
        const code = searchParams.get("code");
        if (code != null) {
          try {
            await supabase.auth.exchangeCodeForSession(code!!);
          } catch (error) {
            console.log(error);
          }
    
          const { data: { session }, error } = await supabase.auth.getSession();
          if (error) {
            console.log(error);
            return;
          }
    
          setSession(session);
    
          router.push('/');
        } else {
          if (session == null && pathname?.includes('/')) {
            router.push('/');
          }
        }
    };
    
    useEffect(() => {
        checkSession();
    }, []);

    useEffect(() => {
        setAvatarSrc(session?.user?.user_metadata.avatar_url ?? "./avatars.jpeg");
    }, [session]);

    return (
        <div>
            <Dropdown placement="bottom-start">
                <DropdownTrigger>
                    <Avatar
                        isBordered
                        as="button"
                        className="transition-transform"
                        src={avatarSrc}
                    />
                </DropdownTrigger>
                <DropdownMenu aria-label="Profile Actions" variant="flat">
                    <DropdownItem key="settings">マイページ</DropdownItem>
                    <DropdownItem key="team_settings">設定</DropdownItem>
                    <DropdownItem key="analytics">Analytics</DropdownItem>
                    <DropdownItem key="help_and_feedback">Q & A</DropdownItem>
                    <DropdownItem key="logout" color="danger" onClick={onOpen}>ログアウト</DropdownItem>
                </DropdownMenu>
            </Dropdown>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1">ログアウトしますか？</ModalHeader>
                    <ModalFooter>
                        <Button color="danger" variant="light" onClick={onClose}>
                            キャンセル
                        </Button>
                        <form action="/auth/logout" method="post">
                            <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center" type="submit">
                                ログアウト
                            </button>
                        </form>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
}

export default UserAvatar;