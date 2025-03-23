import {
  Code,
  Book,
  Music,
  Heart,
  Video,
  Image,
  Coffee,
  Plane,
  MessageCircle,
  Globe,
  LucideProps
} from 'lucide-react';

// 图标映射对象 - 字符串到 Lucide 图标的映射
export const ICON_MAP: Record<
  string,
  React.ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
  >
> = {
  code: Code,
  book: Book,
  music: Music,
  heart: Heart,
  video: Video,
  image: Image,
  coffee: Coffee,
  travel: Plane,
  chat: MessageCircle,
  web: Globe
};
