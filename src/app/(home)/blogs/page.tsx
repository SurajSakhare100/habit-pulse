import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { getSortedPostsData } from '@/lib/blog';
import Link from 'next/link';
export default async function BlogPage() {
  const posts = getSortedPostsData();

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Blog Posts</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link href={`/blogs/${post.id}`} key={post.id}>
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <CardTitle
                 className="text-lg text-blue-600 hover:underline">
                  {post.title}
                </CardTitle>
                <CardDescription className="mt-2 text-sm text-muted-foreground">
                  {post.date}
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
