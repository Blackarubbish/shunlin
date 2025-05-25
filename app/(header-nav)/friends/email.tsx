'use client';
import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function EmailTemplateBox() {
  const [copied, setCopied] = useState(false);

  const emailTemplate = `
网站名称：[您的网站名称]
网站链接：[您的网站URL]
网站描述：[一句话描述您的网站]
头像链接：[您的头像URL]`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(emailTemplate);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <pre className="bg-card-bg border-border text-text-secondary max-h-[300px] overflow-auto rounded-lg border p-4 font-mono text-sm whitespace-pre-wrap">
        {emailTemplate}
      </pre>
      <button
        onClick={copyToClipboard}
        className="bg-card-bg border-border hover:border-primary group absolute top-3 right-3 rounded-md border p-2 transition-all duration-300">
        {copied ? (
          <Check size={18} className="text-green-500" />
        ) : (
          <Copy size={18} className="text-text-tertiary group-hover:text-primary" />
        )}
      </button>
      {copied && (
        <div className="animate-fade-out absolute -top-10 right-0 rounded-md bg-green-500 px-3 py-1 text-sm text-white">
          已复制!
        </div>
      )}
    </div>
  );
}
