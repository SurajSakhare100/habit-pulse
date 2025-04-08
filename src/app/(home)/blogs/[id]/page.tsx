import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import gfm from 'remark-gfm'; // ✅ NEW
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export async function generateStaticParams() {
  const postsDirectory = path.join(process.cwd(), 'posts');
  const filenames = fs.readdirSync(postsDirectory);

  return filenames.map((filename) => ({
    id: filename.replace(/\.md$/, ''),
  }));
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const filePath = path.join(process.cwd(), 'posts', `${params.id}.md`);

  if (!fs.existsSync(filePath)) {
    return {
      title: 'Not Found',
    };
  }

  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data } = matter(fileContents);

  return {
    title: data.title || params.id,
    description: data.excerpt || '',
  };
}

export default async function BlogPostPage({ params }: { params: { id: string } }) {
  const filePath = path.join(process.cwd(), 'posts', `${params.id}.md`);

  if (!fs.existsSync(filePath)) {
    notFound();
  }

  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { content, data } = matter(fileContents);

  const processedContent = await remark()
    .use(gfm)   // ✅ Add GFM support
    .use(html)
    .process(content);

  const contentHtml = processedContent.toString();

  return (
    <div className="max-w-3xl mx-auto p-8">
      <Button className="mb-6">
        <Link
          href="/blogs"
          className="text-sm flex items-center justify-center"
          title="Back to Blogs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span> Back to Blogs</span>
        </Link>
      </Button>
      <h1 className="text-4xl font-bold mb-2">{data.title}</h1>
      <p className="text-sm text-gray-500 mb-6">{data.date}</p>

      <article className="prose prose-neutral dark:prose-invert max-w-none">
        <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
      </article>
    </div>
  );
}
