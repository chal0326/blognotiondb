import { Client } from '@notionhq/client';
import { config } from './config';

const fetchWithTimeout = async (input: RequestInfo, init?: RequestInit) => {
  const timeout = 10000; // 10 seconds timeout
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(input, {
      ...init,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
};

export const notion = new Client({
  auth: config.NOTION_TOKEN,
  fetch: fetchWithTimeout,
});

export const DATABASE_ID = config.NOTION_DATABASE_ID;

// Debug helper
export async function validateNotionConnection(): Promise<void> {
  try {
    // Test database access
    await notion.databases.retrieve({
      database_id: DATABASE_ID,
    });
    console.log('✅ Successfully connected to Notion database');
  } catch (error) {
    if (error.code === 'unauthorized') {
      console.error('❌ Notion API authentication failed. Please check your NOTION_TOKEN.');
    } else if (error.code === 'object_not_found') {
      console.error('❌ Notion database not found. Please check your NOTION_DATABASE_ID.');
    } else if (error.name === 'AbortError') {
      console.error('❌ Notion API request timed out. Please check your network connection.');
    } else {
      console.error('❌ Notion API connection failed:', error.message);
    }
    throw error;
  }
}