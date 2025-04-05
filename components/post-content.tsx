import '@/assets/styles/github-markdown.css';
import '@/assets/styles/bocchi-markdown-themes.css';

interface Props {
  htmlContent: string;
}
export default function PostContent({ htmlContent }: Props) {
  return (
    <div className="markdown-body theme-ryo">
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </div>
  );
}
