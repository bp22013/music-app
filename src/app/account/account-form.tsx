'use client'

import { useCallback, useEffect, useState } from 'react';
import { Database } from '../database/database.types';
import { Input, Button } from '@nextui-org/react';
import { Session, createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Avatar from './avatar';

export default function AccountForm({ session }: { session: Session | null }) {

    const supabase = createClientComponentClient<Database>();
    const [loading, setLoading] = useState(true);
    const [fullname, setFullname] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const [website, setWebsite] = useState<string | null>(null);
    const [avatar_url, setAvatarUrl] = useState<string | null>(null);
    const user = session?.user;

    const getProfile = useCallback(async () => {
        try {
            setLoading(true);

            const { data, error, status } = await supabase
                .from('profiles')
                .select(`full_name, username, website, avatar_url`)
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
        username,
        website,
        avatar_url,
    }: {
        username: string | null
        fullname: string | null
        website: string | null
        avatar_url: string | null
    }) {
        try {
            setLoading(true)

            const { error } = await supabase.from('profiles').upsert({
                id: user?.id as string,
                full_name: fullname,
                username,
                website,
                avatar_url,
                updated_at: new Date().toISOString(),
            })
            if (error) throw error
            console.log('Profile updated!');
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
                        updateProfile({ fullname, username, website, avatar_url: url })
                    }}
                />
                <div className='flex flex-col gap-2 mb-2'>
                    <label htmlFor="email">メールアドレス</label>
                    <Input className='border border-brand-green p-3 rounded-md bg-opacity-50 text-black' id="email" type="text" value={session?.user.email} disabled />
                </div>
                <div className='flex flex-col gap-2 mb-2'>
                    <label htmlFor="fullName">フルネーム</label>
                    <Input
                        className='border border-brand-green p-3 rounded-md bg-opacity-50 text-black'
                        id="fullName"
                        type="text"
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
                        value={username || ''}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className='flex flex-col gap-2 mb-2'>
                    <label htmlFor="website">Website</label>
                    <Input
                        className='border border-brand-green p-3 rounded-md bg-opacity-50 text-black'
                        id="website"
                        type="url"
                        value={website || ''}
                        onChange={(e) => setWebsite(e.target.value)}
                    />
                </div>

                <div className='mx-auto w-fit py-5 min-w-[150px]'>
                    <Button
                        className="bg-red-400 text-white p-3 rounded-md hover:opacity-90 w-full"
                        onClick={() => updateProfile({ fullname, username, website, avatar_url })}
                        disabled={loading}
                    >
                        {loading ? 'ロード中 ...' : '更新'}
                    </Button>
                </div>

                <div className='mx-auto w-fit min-w-[150px]'>
                    <form action="/auth/signout" method="post">
                        <Button className="bg-green-400 text-white p-3 rounded-md hover:opacity-90 w-full" type="submit">
                            ログアウト
                        </Button>
                    </form>
                </div>
            </div>
        </>
    )
}
