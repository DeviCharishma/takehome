import clsx from 'clsx';
import Head from 'next/head';
import { Inter } from '@next/font/google';
import Header from '../components/Header';
import AddUserFab from '../components/AddUserFab';
import UserList from '../components/UserList';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  return (
    <>
      <Head>
        <title>Atllas Takehome</title>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div className={clsx('min-h-screen bg-neutral-50', inter.className)}>
        <Header />
        <main className='mx-auto max-w-5xl px-4 py-4'>
          <UserList />
        </main>
        <AddUserFab />
      </div>
    </>
  );
}
