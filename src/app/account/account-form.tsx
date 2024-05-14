'use client'

import { useCallback, useEffect, useState } from 'react';
import { Database } from '../database/database.types';
import { Input, Button, Textarea } from '@nextui-org/react';
import { Session, createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Avatar from './avatar';

export default function AccountForm({ session }: { session: Session | null }) {

    const supabase = createClientComponentClient<Database>();
    const [loading, setLoading] = useState(true);
    const [fullname, setFullname] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const [website, setWebsite] = useState<string | null>(null);
    const [avatar_url, setAvatarUrl] = useState<string | null>(null);
    const [introduce, setIntroduce] = useState<string | null>(null);

    const user = session?.user;

    const getProfile = useCallback(async () => {
        try {
            setLoading(true);

            const { data, error, status } = await supabase
                .from('profiles')
                .select(`full_name, username, website, avatar_url, introduce`)
                .eq('id', user?.id ?? '')
                .single()

            if (error && status !== 406) {
                throw error;
            };

            if (data) {
                setFullname(data.full_name);
                setUsername(data.username);
                setWebsite(data.website);
                setAvatarUrl(data.avatar_url);
                setIntroduce(data.introduce);
            }
        } catch (error) {
            console.log('ユーザーデータを読み込めませんでした');
        } finally {
            setLoading(false);
        }
    }, [user, supabase])

    useEffect(() => {
      getProfile();
    }, [user, getProfile])

    async function updateProfile({
        fullname,
        username,
        website,
        avatar_url,
        introduce,
    }: {
        fullname: string | null
        username: string | null
        website: string | null
        avatar_url: string | null
        introduce: string | null
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
                updated_at: new Date().toISOString(),
            })
            if (error) throw error
            console.log('プロフィールを更新しました');
        } catch (error) {
            console.log('データを更新できませんでした');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="max-w-2xl mx-auto p-5">
                <Avatar
                    uid={user?.id ?? ''}
                    url={avatar_url}
                    size={150}
                    onUpload={(url) => {
                        setAvatarUrl(url)
                        updateProfile({ fullname, username, website, avatar_url: url, introduce })
                    }}
                />
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
                        onClick={() => updateProfile({ fullname, username, website, avatar_url, introduce })}
                        disabled={loading}
                    >
                        {loading ? 'ロード中 ...' : '更新'}
                    </Button>
                </div>
            </div>
        </>
    )
}

