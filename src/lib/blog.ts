import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'posts');

type PostFrontMatter = {
  title?: string;
  date?: string;
  excerpt?: string;
  bannerImage?: string;
};

export function getSortedPostsData() {
  const fileNames = fs.readdirSync(postsDirectory);

  const allPostsData = fileNames.map((fileName) => {
    const id = fileName.replace(/\.md$/, '');
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    const { data } = matter(fileContents);

    return {
      id,
      ...(data as PostFrontMatter),
    };
  });

  return allPostsData.sort((a, b) => {
    // Sort by date, newest first
    return new Date(b.date ?? '').getTime() - new Date(a.date ?? '').getTime();
  });
}
