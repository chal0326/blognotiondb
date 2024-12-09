export interface Post {
  id: string;
  title: string;
  slug: string;
  publishedDate: string;
  excerpt: string;
  coverImage?: string;
  tags?: string[];
}

export interface PostDetail extends Post {
  content: NotionBlock[];
}

export interface NotionBlock {
  type: 'paragraph' | 'heading_1' | 'heading_2' | 'heading_3' | 'bulleted_list_item' | 'numbered_list_item' | 'code' | 'quote' | 'image';
  paragraph?: {
    rich_text: RichText[];
  };
  heading_1?: {
    rich_text: RichText[];
  };
  heading_2?: {
    rich_text: RichText[];
  };
  heading_3?: {
    rich_text: RichText[];
  };
  bulleted_list_item?: {
    rich_text: RichText[];
  };
  numbered_list_item?: {
    rich_text: RichText[];
  };
  code?: {
    rich_text: RichText[];
    language: string;
  };
  quote?: {
    rich_text: RichText[];
  };
  image?: {
    type: 'external' | 'file';
    external?: { url: string };
    file?: { url: string };
    caption?: RichText[];
  };
}

export interface RichText {
  type: 'text' | 'mention' | 'equation';
  text?: {
    content: string;
    link?: { url: string };
  };
  annotations?: {
    bold: boolean;
    italic: boolean;
    strikethrough: boolean;
    underline: boolean;
    code: boolean;
    color: string;
  };
  plain_text: string;
  href?: string;
}