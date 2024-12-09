import { notion, DATABASE_ID, validateNotionConnection } from './client';
import { NotionError } from './errors';
import { mapPageToPost, mapPageToPostDetail } from './mappers';
import { withRetry } from './retry';
import { mockPosts, mockPostDetails } from './mock-data';
import type { Post, PostDetail } from '../../types/notion';

const isDev = import.meta.env.DEV;

let isConnectionValidated = false;

async function ensureConnection() {
  if (!isConnectionValidated) {
    await validateNotionConnection();
    isConnectionValidated = true;
  }
}

export async function getPosts(): Promise<Post[]> {
  try {
    if (!isDev) {
      await ensureConnection();
    }

    return await withRetry(async () => {
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

      return response.results.map(mapPageToPost);
    });
  } catch (error) {
    console.warn('Failed to fetch posts from Notion:', error);
    
    if (isDev) {
      console.info('Using mock data in development mode');
      return mockPosts;
    }
    
    throw NotionError.fromError(error, 'Failed to fetch posts');
  }
}

export async function getPost(slug: string): Promise<PostDetail | null> {
  try {
    if (!isDev) {
      await ensureConnection();
    }

    return await withRetry(async () => {
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

      return mapPageToPostDetail(page, blocks.results);
    });
  } catch (error) {
    console.warn(`Failed to fetch post with slug ${slug} from Notion:`, error);
    
    if (isDev) {
      console.info('Using mock data in development mode');
      return mockPostDetails[slug] || null;
    }
    
    throw NotionError.fromError(error, `Failed to fetch post with slug: ${slug}`);
  }
}