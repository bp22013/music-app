'use client';

import { Avatar, Button, Input, Spacer, user } from "@nextui-org/react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { userInfo } from "os";
import React, { useEffect, useState } from "react";

const MyPage = () => {
    
    const supabase = createClientComponentClient();
    const [session, setSession] = useState<any>();
    const [name, setName] = useState("");
    const [newName, setNewName] = useState("");
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [userID, setUserID] = useState("");

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        const { data: { user } } = await supabase.auth.getUser();

        if (user === null) return;

        setUserID(user.id);

        const { data: profile, error } = await supabase
            .from('profiles')
            .select()
            .eq("id", user.id);

        if (error) {
            console.log(error);
            return;
        }

        if (profile.length === 1) {
            setName(profile[0].name);
        }
    };

    const onChangeName = async (event: any) => {
        event.preventDefault();
        if (userID === "") {
            return;
        }
        
        // Update user metadata
        const { data, error } = await supabase.auth.updateUser({
            data: { name: newName }
        })
        
        if (error) {
            console.log(error);
            return;
        }
        
        setName(newName); // Update displayed name
    };

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

    useEffect(() => {
        setName(session?.user?.user_metadata.name);
    }, [session]);

    return (
        <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8 pb-16 pt-20 text-center lg:pt-32">
            <h1 className="text-2xl font-bold">
                ログインに成功しました
            </h1>
            <Spacer y={4}></Spacer>
            <form onSubmit={onChangeName}>
                <label
                    htmlFor="name"
                    className="block mb-2 text-sm text-left font-medium text-gray-900"
                >
                    名前
                </label>
                <div className="flex w-full">
                    <Input
                        type="text"
                        name="name"
                        id="name"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        placeholder="山田 太郎"
                        onChange={onChangeName}
                        value={newName} // Use newName state instead of name
                        required
                    />
                    <Button
                        className="ml-2 min-w-fit text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                        type="submit"
                    >
                        更新
                    </Button>
                </div>
            </form>
            <Spacer y={4}></Spacer>
            <form action="/auth/logout" method="post">
                <Button
                    className=" text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                    type="submit"
                >
                    ログアウト
                </Button>
            </form>
        </div>
    )
}

export default MyPage;
