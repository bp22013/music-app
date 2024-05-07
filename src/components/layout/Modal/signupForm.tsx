"use client";

import { supabase } from "@/utils/supabase/supabase-client";
import { useState } from "react";
import { useModal } from "@/utils/Providers/ModalProvider";
import React from "react";
import { Button, Checkbox, Input, Link, Modal, ModalContent,
         ModalHeader, ModalFooter, ModalBody, Popover, PopoverTrigger,
         PopoverContent, 
         Divider} from "@nextui-org/react";
import GoogleButton from "../Button/googleButton";
import FacebookButton from "../Button/facebookButton";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const SignUpForm = () => {

    const { isOpen, openModal, closeModal } = useModal();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConf, setPasswordConf] = useState("");

    const supabase = createClientComponentClient()

    const onSubmit = async (event: any) => {
        event.preventDefault();
        try {
            const { error: signUpError } = await supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    emailRedirectTo: `${location.origin}/auth/callback`,
                },
            });
            if (signUpError) {
                throw signUpError;
            }
            alert("登録完了メールを確認してください");
        } catch (error) {
            alert("エラーが発生しました");
        }
    }

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
        <Modal isOpen={isOpen} onClose={closeModal} backdrop="blur">
            <ModalContent>
                <ModalHeader className="flex items-center justify-center flex-col gap-4">新規登録</ModalHeader>
                <ModalBody>
                    <form className="space-y-4" onSubmit={onSubmit}>
                        <div>
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">
                                メールアドレス
                            </label>
                            <Input
                                type="email"
                                name="email"
                                id="email"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                placeholder="name@company.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">
                                パスワード
                            </label>
                            <Input
                                type="password"
                                name="password"
                                id="password"
                                placeholder="••••••••"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="passwordConf" className="block mb-2 text-sm font-medium text-gray-900">
                              パスワード（確認）
                            </label>
                            <Input
                                type="password"
                                name="passwordConf"
                                id="passwordConf"
                                placeholder="••••••••"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                required
                                value={passwordConf}
                                onChange={(e) => setPasswordConf(e.target.value)}
                            />
                        </div>
                        <div>
                            <Button type="submit" className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                                サインアップ
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
    );
}

export default SignUpForm;