import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const config = {
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  OUTPUT_DIR: process.env.OUTPUT_DIR || path.join(process.cwd(), 'output'),
  BLOG_PROMPT: process.env.BLOG_PROMPT || '',
  CONTENT_SUBDIR: 'blog',
  IMAGE_SUBDIR: 'banners',
  TAGS: (process.env.TAGS || '').split(','),
};

if (!config.GEMINI_API_KEY) {
  console.warn('Warning: GEMINI_API_KEY is missing in .env file');
}
