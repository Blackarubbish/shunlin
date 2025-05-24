import { Tag } from 'lucide-react';

const PostTag = ({ name }: { name: string }) => {
  return (
    <span className="bg-tag flex items-center rounded-md px-2 py-1 text-xs">
      <Tag size={14} strokeWidth={3} className="text-primary mr-1 font-bold" />
      <span className="text-text-secondary">{name}</span>
    </span>
  );
};

export default PostTag;
