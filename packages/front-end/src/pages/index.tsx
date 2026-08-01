import { useState } from 'react';
import clsx from 'clsx';
import Head from 'next/head';
import { Inter } from '@next/font/google';
import Header from '../components/Header';
import AddUserFab from '../components/AddUserFab';
import UserList from '../components/UserList';
import UserFormModal from '../components/UserFormModal';
import DeleteConfirmDialog from '../components/DeleteConfirmDialog';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { useSortState } from '../hooks/useSortState';

const inter = Inter({ subsets: ['latin'] });
const SEARCH_DEBOUNCE_MS = 300;

export default function Home() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, SEARCH_DEBOUNCE_MS);
  const { sortBy, sortOrder, toggleSort, setSort } = useSortState();

  return (
    <>
      <Head>
        <title>Atllas Takehome</title>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div className={clsx('min-h-screen bg-neutral-50', inter.className)}>
        <Header
          search={search}
          onSearchChange={setSearch}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={setSort}
        />
        <main className='mx-auto max-w-5xl px-4 py-4'>
          <UserList
            search={debouncedSearch}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortChange={toggleSort}
          />
        </main>
        <AddUserFab />
        <UserFormModal />
        <DeleteConfirmDialog />
      </div>
    </>
  );
}
