import React, { ReactNode, Suspense } from 'react';
import '@/styles/globals.css';
import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { NextFont } from 'next/dist/compiled/@next/font';
import { SpeedInsights } from '@vercel/speed-insights/next';
import NavigationBar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import { ModalProvider } from '@/utils/Providers/ModalProvider';

export const metadata:Metadata = {
    title: 'music-app',
    description: 'Generated by Next.js',
}

const inter: NextFont = Inter({subsets: ['latin']});

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="ja">
            <ModalProvider>
                <body className={ inter.className }>
                    <div>
                        <SpeedInsights />
                        <Suspense>
                        <NavigationBar />
                            <div className='flex h-screen flex-col'>
                                <div className='mb-auto'>
                                    <main>
                                        { children } 
                                    </main>
                                </div>
                                <Footer />
                            </div>
                        </Suspense>
                    </div>
                </body>
            </ModalProvider>
        </html>
    );
}
