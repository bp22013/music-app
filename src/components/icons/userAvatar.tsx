import React, { useState, useEffect, useCallback } from "react";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Modal, ModalContent, ModalHeader, ModalFooter, Avatar, useDisclosure } from "@nextui-org/react";
import { createClientComponentClient, Session } from '@supabase/auth-helpers-nextjs';
import { BsDoorOpen, BsQuestionCircle, BsFillGearFill, BsFillPersonFill } from "react-icons/bs";
import { Database } from "@/app/database/database.types";

const UserAvatar = ({ session }: { session: Session | null }) => {
    const supabase = createClientComponentClient<Database>();
    const [loading, setLoading] = useState(true);
    const [avatar_url, setAvatarUrl] = useState<string | null>(null);

    const { isOpen, onOpen, onClose } = useDisclosure();

    const user = session?.user;

    const getProfile = useCallback(async () => {
        try {
            setLoading(true);

            const { data, error, status } = await supabase
                .from('profiles')
                .select(`avatar_url`)
                .eq('id', user?.id ?? '')
                .single()

            if (error && status !== 406) {
                throw error;
            };

            if (data) {
                setAvatarUrl(data.avatar_url);
            }
        } catch (error) {
            console.log('ユーザーデータを読み込めませんでした');
        } finally {
            setLoading(false);
        }
    }, [user, supabase]);

    useEffect(() => {
      if (user) {
        getProfile();
      }
    }, [user, getProfile]);

    return (
        <div>
            <Dropdown placement="bottom-start">
                <DropdownTrigger>
                    <Avatar
                        isBordered
                        as="button"
                        className="transition-transform"
                        src="0f5901df-ecdd-42d6-aaee-ee968df49220-0.4071988955189749.jpeg"
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

