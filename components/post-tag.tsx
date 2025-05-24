import { Tag } from 'lucide-react';
import Link from 'next/link';

const PostTag = ({ name, href }: { name: string; href: string }) => {
  return (
    <Link href={href} className="bg-tag flex items-center rounded-md px-2 py-1 text-xs">
      <Tag size={14} strokeWidth={3} className="text-primary mr-1 font-bold" />
      <span className="text-text-secondary">{name}</span>
    </Link>
  );
};

export default PostTag;
