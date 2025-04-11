import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import gfm from 'remark-gfm';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

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
    .use(gfm)
    .use(html)
    .process(content);

  const contentHtml = processedContent.toString();

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Button variant="ghost" className="mb-6 hover:bg-gray-100">
            <Link href="/blogs" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Blogs
            </Link>
          </Button>
        </div>

          <article>
            <header className="mb-8 pb-8 border-b">
              <h1 className="text-4xl font-bold mb-4">{data.title}</h1>
              <div className="flex items-center gap-4">
                <time className="text-muted-foreground">
                  {new Date(data.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
                {data.readTime && (
                  <>
                  <span className="text-muted-foreground">·</span>
                  <span className="text-muted-foreground">{data.readTime} min read</span>
                  </>
                )}
              </div>
            </header>

            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
            </div>
          </article>
      </div>
    </div>
  );
}
