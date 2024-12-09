import type { Post, PostDetail } from '../../types/notion';

export function mapPageToPost(page: any): Post {
  if (!page?.properties) {
    throw new Error('Invalid page structure: missing properties');
  }

  return {
    id: page.id,
    title: page.properties.Title?.title[0]?.plain_text ?? 'Untitled',
    slug: page.properties.Slug?.rich_text[0]?.plain_text ?? '',
    publishedDate: page.properties.Published?.date?.start ?? '',
    excerpt: page.properties.Excerpt?.rich_text[0]?.plain_text ?? '',
    coverImage: page.cover?.external?.url ?? page.cover?.file?.url,
    tags: page.properties.Tags?.multi_select?.map((tag: any) => tag.name) ?? [],
  };
}

export function mapPageToPostDetail(page: any, blocks: any[]): PostDetail {
  return {
    ...mapPageToPost(page),
    content: blocks,
  };
}