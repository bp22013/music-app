'use client'

import React, { useEffect, useState } from 'react';
import { Database } from '../database/database.types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Image from 'next/image';
import { Button } from '@nextui-org/react';

type Profiles = Database['public']['Tables']['profiles']['Row'];

export default function Avatar({
  uid,
  url,
  size,
  onUpload,
}: {
  uid: string
  url: Profiles['avatar_url']
  size: number
  onUpload: (url: string) => void
}) {
  const supabase = createClientComponentClient<Database>();
  const [avatarUrl, setAvatarUrl] = useState<Profiles['avatar_url']>(url);
  const [uploading, setUploading] = useState(false);

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

  const uploadAvatar: React.ChangeEventHandler<HTMLInputElement> = async (event) => {
    try {
      setUploading(true)

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('写真を選択してください')
      };

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${uid}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file);

      if (uploadError) {
        throw uploadError
      };

      onUpload(filePath)
    } catch (error) {
        console.log('アバターをアップロード出来ませんでした。');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className='pb-10'>
      {avatarUrl ? (
        <Image
          width={size}
          height={size}
          src={avatarUrl}
          alt="Avatar"
          radius="full"
          className="w-fit mx-auto pb-3 object-cover"
          style={{ height: size, width: size }}
        />
      ) : (
        <div className="w-fit mx-auto" style={{ height: size, width: size }} />
      )}
      <div className='mx-auto' style={{ width: size }}>
        <Button
          className="p-3 rounded-md hover:opacity-90 cursor-pointer w-fit mx-auto flex justify-center"
          variant="flat"
          color="primary"
          size='md'
          disabled={uploading}
          onClick={() => document.getElementById('single')?.click()}
        >
          {uploading ? 'アップロード中 ...' : '写真をアップロード'}
        </Button>
        <input
          style={{
            visibility: 'hidden',
            position: 'absolute',
          }}
          type="file"
          id="single"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading}
        />
      </div>
    </div>
  )
}
