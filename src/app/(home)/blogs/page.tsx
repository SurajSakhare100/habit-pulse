import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { getSortedPostsData } from '@/lib/blog';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default async function BlogPage() {
  const posts = getSortedPostsData();

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Latest Blog Posts</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Discover insights and strategies for building better habits and improving your daily routines.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link href={`/blogs/${post.id}`} key={post.id}>
            <Card className="h-full cursor-pointer hover:shadow-lg transition-all duration-300 border-opacity-40">
              <CardContent className="p-6">
                <CardTitle className="text-xl mb-2 line-clamp-2">
                  {post.title}
                </CardTitle>
                {post.excerpt && (
                  <CardDescription className="mb-4 line-clamp-3">
                    {post.excerpt}
                  </CardDescription>
                )}
                <div className="flex items-center text-sm text-muted-foreground mt-auto">
                  <span>
                    {post.date ? new Date(post.date).toLocaleDateString('en-US', { 
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : 'No date'}
                  </span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
