'use client'

import React, { useEffect, useState } from 'react';
import { Database } from '@/app/database/database.types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Image } from '@nextui-org/react';
import NextImage from "next/image";

type Profiles = Database['public']['Tables']['profiles']['Row'];

export default function Avatar({
  uid,
  url,
  size,
}: {
  uid: string
  url: Profiles['avatar_url']
  size: number
}) {
  const supabase = createClientComponentClient<Database>();
  const [avatarUrl, setAvatarUrl] = useState<Profiles['avatar_url']>(url);

  useEffect(() => {
    async function downloadImage(path: string) {
      try {
        const { data, error } = await supabase.storage.from('avatars').download(path)
        if (error) {
          throw error;
        };

        const url = URL.createObjectURL(data);
        setAvatarUrl(url);
      } catch (error) {
        console.log('ダウンローダエラー: ', error);
      };
    }

    if (url) downloadImage(url)
  }, [url, supabase]);

  return (
    <div>
      {avatarUrl ? (
        <Image
          as={NextImage}
          width={size}
          height={size}
          src={avatarUrl}
          alt="Avatar"
          className="w-fit mx-auto object-cover"
          radius='full'
          style={{ height: size, width: size }}
        />
      ) : (
        <Image
          as={NextImage}
          width={size}
          height={size}
          src="./avatars.jpeg"
          alt='Avatar'
          className='w-fit mx-auto my-auto object-cover'
          radius='full'
          style={{ height: size, width: size }}
        />
      )}
    </div>
  )
}
