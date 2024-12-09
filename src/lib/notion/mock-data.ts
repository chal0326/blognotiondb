import type { Post, PostDetail } from '../../types/notion';

export const mockPosts: Post[] = [
  {
    id: '1',
    title: 'Getting Started with Astro',
    slug: 'getting-started-with-astro',
    publishedDate: '2024-01-01',
    excerpt: 'Learn how to build fast websites with Astro',
    tags: ['astro', 'web development'],
  },
  {
    id: '2',
    title: 'Building with Notion as a CMS',
    slug: 'building-with-notion-cms',
    publishedDate: '2024-01-02',
    excerpt: 'Using Notion as a CMS for your blog',
    tags: ['notion', 'cms'],
  },
];

export const mockPostDetails: Record<string, PostDetail> = {
  'getting-started-with-astro': {
    ...mockPosts[0],
    content: [
      {
        type: 'paragraph',
        paragraph: {
          rich_text: [
            {
              type: 'text',
              text: { content: 'Welcome to Astro!' },
              plain_text: 'Welcome to Astro!',
            },
          ],
        },
      },
    ],
  },
  'building-with-notion-cms': {
    ...mockPosts[1],
    content: [
      {
        type: 'paragraph',
        paragraph: {
          rich_text: [
            {
              type: 'text',
              text: { content: 'Learn about Notion as a CMS.' },
              plain_text: 'Learn about Notion as a CMS.',
            },
          ],
        },
      },
    ],
  },
};