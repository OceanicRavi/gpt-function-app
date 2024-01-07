'use client'
import React from 'react';
import useGptFunctionData from './utils/useGptFunctionData';
import GptFunctionTable from './ui/table';
import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/24/outline';

export default function IndexPage() {
  const { gptFunctionRecords, isLoading, error } = useGptFunctionData();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading data!</p>;

  return (
    <main className="items-start rounded bg-black bg-opacity-90 flex grow basis-[0%] flex-col pt-4 pb-12 px-8 max-md:max-w-full max-md:px-5">
      <div className="flex w-[758px] max-w-full justify-between gap-5 self-start items-start max-md:flex-wrap">
        <div className="text-white text-4xl font-medium leading-9 w-[257px] mt-4">
          GPT Functions
        </div>
      </div>
      <div className="items-stretch self-stretch flex justify-between gap-3 mt-8 pr-20 max-md:max-w-full max-md:flex-wrap max-md:pr-5">
        <Link
          href="/gptfunction"
          className="justify-between items-stretch rounded bg-white bg-opacity-20 flex gap-2 px-4 py-2"
        >
          <span className="text-white text-base font-medium leading-6 tracking-normal grow whitespace-nowrap">Add new function</span>
          <PlusIcon className="h-5 md:ml-4 text-white text-base font-medium" />
        </Link>
      </div>
        <GptFunctionTable records={gptFunctionRecords} />
    </main>
  );
}
