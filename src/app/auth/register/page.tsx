'use client';

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextPage } from "next";
import { useState } from 'react';
import { Database } from '@/app/database/database.types';
import { Input, Button, Textarea, ModalContent, useDisclosure, Modal, ModalHeader, ModalFooter } from '@nextui-org/react';
import Avatar from '@/app/account/avatar';

const AccountForm:NextPage = async () => {

    const supabase = createServerComponentClient<Database>({ cookies });
    const [loading, setLoading] = useState(true);
    const [fullname, setFullname] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const [website, setWebsite] = useState<string | null>(null);
    const [avatar_url, setAvatarUrl] = useState<string | null>(null);
    const [introduce, setIntroduce] = useState<string | null>(null);
    const [sex, setSex] = useState<string | null>(null);

    const { isOpen, onOpen, onClose } = useDisclosure();

    const {
        data: { session },
    } = await supabase.auth.getSession()

    const user = session?.user;

    async function registerProfile({
        fullname,
        username,
        website,
        avatar_url,
        introduce,
        sex,
    }: {
        fullname: string | null
        username: string | null
        website: string | null
        avatar_url: string | null
        introduce: string | null
        sex: string | null
    }) {
        try {
            setLoading(true)

            const { error } = await supabase.from('profiles').upsert({
                id: user?.id as string,
                full_name: fullname,
                username,
                website,
                avatar_url,
                introduce,
                sex,
                updated_at: new Date().toISOString(),
            })
            if (error) throw error
            console.log('プロフィールを登録しました');
            onOpen();
        } catch (error) {
            console.log('データを登録できませんでした');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="max-w-2xl mx-auto my-auto">
                <div className="flex justify-center mb-4 my-5">
                    <Avatar
                        uid={user?.id ?? ''}
                        url={avatar_url}
                        size={150}
                        onUpload={(url) => {
                            setAvatarUrl(url)
                            registerProfile({ fullname, username, website, avatar_url: url, introduce ,sex})
                        }}
                    />
                </div>
                <div className='flex flex-col gap-2 mb-2'>
                    <label htmlFor="email">メールアドレス</label>
                    <Input className='border border-brand-green p-3 rounded-md bg-opacity-50 text-black' id="email" type="text" value={session?.user.email} disabled />
                </div>
                <div className='flex flex-col gap-2 mb-2'>
                    <label htmlFor="fullName">名前</label>
                    <Input
                        className='border border-brand-green p-3 rounded-md bg-opacity-50 text-black'
                        id="fullName"
                        type="text"
                        defaultValue='name'
                        value={fullname || ''}
                        onChange={(e) => setFullname(e.target.value)}
                    />
                </div>
                <div className='flex flex-col gap-2 mb-2'>
                    <label htmlFor="username">ユーザーネーム</label>
                    <Input
                        className='border border-brand-green p-3 rounded-md bg-opacity-50 text-black'
                        id="username"
                        type="text"
                        placeholder='user'
                        value={username || ''}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className='flex flex-col gap-2 mb-2'>
                    <label htmlFor="website">リンク</label>
                    <Input
                        className='border border-brand-green p-3 rounded-md bg-opacity-50 text-black'
                        id="website"
                        type="url"
                        value={website || ''}
                        placeholder='example@url.com'
                        onChange={(e) => setWebsite(e.target.value)}
                    />
                </div>
                <div className='flex flex-col gap-2 mb-2'>
                    <label htmlFor='introduce'>自己紹介</label>
                    <Textarea
                        className='border border-brand-green p-3 rounded-md bg-opacity-50 text-black'
                        id='introduce'
                        value={introduce || ''}
                        placeholder=''
                        rows={6}
                        onChange={(e) => setIntroduce(e.target.value)}
                    />
                </div>

                <div className='mx-auto w-fit py-5 min-w-[150px]'>
                    <Button
                        className="bg-red-400 text-white p-3 rounded-md hover:opacity-90 w-full"
                        onClick={() => registerProfile({ fullname, username, website, avatar_url, introduce, sex })}
                        disabled={loading}
                    >
                        {loading ? 'ロード中 ...' : '登録'}
                    </Button>
                </div>
                <div>
                    <Modal isOpen={isOpen} onClose={onClose}>
                        <ModalContent>
                            <ModalHeader>更新しました</ModalHeader>
                            <ModalFooter>
                                <Button color="primary" variant="light" onClick={onClose}>
                                    閉じる
                                </Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                </div>
            </div>
        </>
    )
}

export default AccountForm;
