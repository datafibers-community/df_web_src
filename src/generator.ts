import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from './config';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);

export interface BlogPost {
  title: string;
  content: string;
  frontMatter: any;
  imagePrompt: string;
  imageFilename: string;
}

export async function generateBlogPost(tags: string[]): Promise<BlogPost> {
  const modelsToTry = [
    'gemini-2.5-flash',
    'gemini-2.5-flash-lite',
    'gemini-flash-latest',
    'gemma-3-27b-it'
  ];
  let lastError: any = null;

  for (const modelName of modelsToTry) {
    try {
      console.log(`Using model: ${modelName}...`);
      const model = genAI.getGenerativeModel({ model: modelName });

      const basePrompt = config.BLOG_PROMPT || `
        You are a technical content creator for the DataFibers Community.
        Generate a high-quality, DEEP-DIVE technical blog post about: ${tags.join(', ')}.
        
        CONTENT REQUIREMENTS:
        1. AVOID GENERIC OVERVIEWS. Focus on "under-the-hood" details, architectural patterns, and practical implementation challenges.
        2. EXPLAIN VIA CODE & DIAGRAMS: Use tables, detailed code snippets, configuration examples (YAML, JSON, XML), CLI command walk-throughs, and text-based diagrams (like ASCII or Mermaid) to explain concepts. 
        3. CODE & DIAGRAM FORMATTING: Every single code block, configuration snippet, and technical diagram MUST be wrapped in triple backticks (\`\`\`) with the appropriate language identifier when applicable. 
        4. NEVER present code-like content or technical diagrams as plain text. 
        5. Use technical terminology correctly and explain complex concepts through analogies if needed.
        
        BANNER IMAGE REQUIREMENTS:
        Your "imagePrompt" must describe a TANGIBLE, professional, and minimalist flat-vector illustration.
        STYLE: Use a clean, modernist vector-art aesthetic. Avoid photographic realism, 3D renders, or complex textures. 
        VISUALS: Use simple geometric shapes, clean lines, and a professional, muted color palette (e.g., shades of blue, coral/orange, and grey).
        SCENE: Describe specific visuals like "a stylized, iconic representation of a lighthouse", "large, clean technical logos on octagonal backgrounds", or "simple fiber optic cables represented as glowing lines". 
        BACKGROUND: Keep it simple with subtle geometric patterns or soft shapes.
        
        FORMATTING RULES:
        1. Follow Hugo markdown standards.
        2. Do not include front matter in the content field.
        3. IMPORTANT: Your output is a JSON string. Ensure all special characters in your content (like double quotes, NEWLINES within code blocks, and backslashes) are properly escaped to maintain valid JSON.
      `;

      const prompt = `
        ${basePrompt}
        
        The output must BE ONLY a JSON object with the following structure:
        {
          "title": "A compelling, specific technical title",
          "content": "Full markdown content of the blog post with tables and code examples",
          "tags": ["tag1", "tag2"],
          "categories": ["category1"],
          "imagePrompt": "A highly specific, detailed visual description for a professional technical banner image"
        }
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Clean up potential markdown code blocks if the AI included them
      const cleanedJson = text.replace(/```json|```/g, '').trim();
      const data = JSON.parse(cleanedJson);

      const date = new Date().toISOString().split('T')[0];
      const slug = data.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, '');
      const imageFilename = `${date}-${slug}.jpg`;

      const frontMatter = {
        title: data.title,
        date: date,
        tags: data.tags || tags,
        categories: data.categories || ['Technology'],
        banner: `img/banners/${imageFilename}`,
      };

      return {
        title: data.title,
        content: data.content,
        frontMatter: frontMatter,
        imagePrompt: data.imagePrompt,
        imageFilename: imageFilename
      };
    } catch (err: any) {
      console.warn(`Model ${modelName} failed: ${err.message || 'Unknown error'}. Trying next...`);
      lastError = err;
      continue;
    }
  }

  throw lastError || new Error('All models failed to generate content');
}

export async function generateBannerImage(prompt: string, outputPath: string) {
  console.log(`Generating free image for: ${prompt}`);

  const encodedPrompt = encodeURIComponent(prompt);
  const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=900&height=600&nologo=true&seed=${Math.floor(Math.random() * 1000000)}`;

  const imageResponse = await axios.get(imageUrl, { responseType: 'stream' });
  const writer = fs.createWriteStream(outputPath);
  imageResponse.data.pipe(writer);

  return new Promise<void>((resolve, reject) => {
    writer.on('finish', () => resolve());
    writer.on('error', reject);
  });
}
