import React from "react";
import { Button, Checkbox, Input, Link, Modal, ModalContent,
         ModalHeader, ModalFooter, ModalBody, Popover, PopoverTrigger,
         PopoverContent, Divider } from "@nextui-org/react";
import GoogleButton from "../Button/googleButton";
import FacebookButton from "../Button/facebookButton";
import { useModal } from "@/utils/Providers/ModalProvider";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const LoginModal = () => {
    const { isOpen, openModal, closeModal } = useModal();

    const supabase = createClientComponentClient()

    const handleSocialLogin = async (prov: any) => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: prov,
            options: {
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent',
                },
            },
        })

    if (error) {
        console.log(error);
        return
    }

    }

    return (
        <>
            <Modal isOpen={isOpen} onClose={closeModal} backdrop="blur">
                <ModalContent>
                    <ModalHeader className="flex items-center justify-center flex-col gap-4">ログイン</ModalHeader>
                    <ModalBody>
                        <form action="/auth/login" method="post" className="space-y-4 mb-10">
                            <Input
                                isRequired
                                isClearable
                                type="email"
                                name="email"
                                variant="bordered"
                                id="email"
                                label="メールアドレス"
                                placeholder="name@company.com"
                                required
                            />
                            <Input
                                isRequired
                                isClearable
                                type="password"
                                name="password"
                                id="password"
                                label="パスワード"
                                variant="bordered"
                                placeholder="••••••••"
                                required
                            />
                            <div className="flex py-2 px-1 justify-between">
                                <Checkbox classNames={{ label: 'text-small' }}>ログインを記憶する</Checkbox>
                                <Link color="primary" href="/resetPassword" size="sm">
                                    パスワードを忘れた方はこちら
                                </Link>
                            </div>
                            <div className="modal-footer flex justify-end">
                                <Button color="danger" variant="flat" onPress={closeModal}>
                                    キャンセル
                                </Button>
                                <Button color="primary" variant="shadow" type="submit" className="ml-2">
                                    ログイン
                                </Button>
                            </div>
                        </form>
                    </ModalBody>
                    <ModalFooter>
                        <div>
                            <Divider className="my-4" />
                            <div className="flex h-5 items-center space-x-2 text-small">
                                <div>
                                    <GoogleButton handleClickMethod={handleSocialLogin}></GoogleButton>
                                </div>
                                <Divider orientation="vertical" />
                                <div>
                                    <FacebookButton handleClickMethod={handleSocialLogin}></FacebookButton>
                                </div>
                            </div>  
                        </div>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    
    );
};

export default LoginModal;
