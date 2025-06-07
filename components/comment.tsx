'use client';

import { Twikoo } from '@/components/twikoo';

export const Comment = () => {
  return (
    <div className="mb-16 w-full">
      <div className="twikoo-container">
        <div className="mb-6">
          <h2 className="text-text flex items-center gap-2 text-2xl font-bold">
            <span>💬</span>
            评论交流
          </h2>
          <p className="text-text-secondary mt-2 text-sm">
            交流的意思是沟通一下，不是吵架。吵架的意思是大声地沟通一下，不是准备打架
          </p>
        </div>
        <Twikoo />
      </div>
    </div>
  );
};
