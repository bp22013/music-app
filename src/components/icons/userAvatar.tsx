import React, { useState, useEffect, useCallback } from "react";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Modal, ModalContent, ModalHeader, ModalFooter, Avatar, useDisclosure } from "@nextui-org/react";
import { createClientComponentClient, Session } from '@supabase/auth-helpers-nextjs';
import { BsDoorOpen, BsQuestionCircle, BsFillGearFill, BsFillPersonFill } from "react-icons/bs";
import { Database } from "@/app/database/database.types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const UserAvatar = () => {

    const supabase = createClientComponentClient<Database>();
    const [session, setSession] = useState<any>();
    const [avatar_url, setAvatarUrl] = useState<string | null>(null);
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { isOpen, onOpen, onClose } = useDisclosure();

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

    return (
        <div>
            <Dropdown placement="bottom-start">
                <DropdownTrigger>
                    <Avatar
                        isBordered
                        as="button"
                        className="transition-transform"
                        src={session?.user?.user_metadata.avatar_url}
                    />
                </DropdownTrigger>
                <DropdownMenu aria-label="Profile Actions" variant="flat">
                    <DropdownItem key="settings" color="primary" href="/profile">
                        <div className="flex item_center justify-between">
                            <span>マイページ</span>
                            <BsFillPersonFill className="w-4 h-4"/>
                        </div> 
                    </DropdownItem>
                    <DropdownItem key="team_settings" color="primary" href="/account">
                        <div className="flex item_center justify-between">
                            <span>設定</span>
                            <BsFillGearFill className="w-4 h-4"/>
                        </div>
                    </DropdownItem>
                    <DropdownItem key="help_and_feedback" color="primary">
                        <div className="flex item_center justify-between">
                            <span>Q & A</span>
                            <BsQuestionCircle className="w-4 h-4"/>
                        </div>
                    </DropdownItem>
                    <DropdownItem key="logout" color="danger" onClick={onOpen}>
                        <div className="flex items-center justify-between">
                            <span>ログアウト</span>
                            <BsDoorOpen className="w-4 h-4" />
                        </div>
                    </DropdownItem>
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
