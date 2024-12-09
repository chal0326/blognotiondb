import { Client } from '@notionhq/client';
import type { Post, PostDetail } from '../types/notion';

const notion = new Client({
  auth: import.meta.env.NOTION_TOKEN,
});

const DATABASE_ID = import.meta.env.NOTION_DATABASE_ID;

export class NotionError extends Error {
  constructor(message: string, public originalError?: unknown) {
    super(message);
    this.name = 'NotionError';
  }
}

export async function getPosts(): Promise<Post[]> {
  try {
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      sorts: [
        {
          property: 'Published',
          direction: 'descending',
        },
      ],
      filter: {
        property: 'Status',
        select: {
          equals: 'Published',
        },
      },
    });

    return response.results.map((page: any) => ({
      id: page.id,
      title: page.properties.Title.title[0]?.plain_text ?? 'Untitled',
      slug: page.properties.Slug.rich_text[0]?.plain_text ?? '',
      publishedDate: page.properties.Published.date?.start ?? '',
      excerpt: page.properties.Excerpt.rich_text[0]?.plain_text ?? '',
      coverImage: page.cover?.external?.url ?? page.cover?.file?.url,
      tags: page.properties.Tags.multi_select.map((tag: any) => tag.name),
    }));
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw new NotionError('Failed to fetch posts', error);
  }
}

export async function getPost(slug: string): Promise<PostDetail | null> {
  try {
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      filter: {
        and: [
          {
            property: 'Slug',
            rich_text: {
              equals: slug,
            },
          },
          {
            property: 'Status',
            select: {
              equals: 'Published',
            },
          },
        ],
      },
    });

    if (!response.results.length) {
      return null;
    }

    const page = response.results[0];
    const blocks = await notion.blocks.children.list({
      block_id: page.id,
    });

    return {
      id: page.id,
      title: page.properties.Title.title[0]?.plain_text ?? 'Untitled',
      slug: page.properties.Slug.rich_text[0]?.plain_text ?? '',
      publishedDate: page.properties.Published.date?.start ?? '',
      excerpt: page.properties.Excerpt.rich_text[0]?.plain_text ?? '',
      coverImage: page.cover?.external?.url ?? page.cover?.file?.url,
      tags: page.properties.Tags.multi_select.map((tag: any) => tag.name),
      content: blocks.results,
    };
  } catch (error) {
    console.error('Error fetching post:', error);
    throw new NotionError('Failed to fetch post', error);
  }
}