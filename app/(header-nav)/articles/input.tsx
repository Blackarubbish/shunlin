'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SearchInput() {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const router = useRouter();
  const [value, setValue] = useState(params.get('searchKey') || '');

  const genPageUrl = () => {
    const queryParam = new URLSearchParams();
    let res = `/articles`;

    if (value) {
      queryParam.set('searchKey', value);
    }

    const category = params.get('category');
    if (category) {
      queryParam.set('category', category);
    }
    res += `?${queryParam.toString()}`;
    return res;
  };

  return (
    <input
      type="text"
      placeholder="搜索文章..."
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          router.push(genPageUrl());
        }
      }}
      className="bg-input-bg text-text border-border focus:border-primary focus:ring-primary w-full rounded-full border py-2.5 pr-5 pl-[45px] text-sm transition-all duration-300 ease-in-out focus:ring-1 focus:outline-none md:py-3 md:text-base"
    />
  );
}
