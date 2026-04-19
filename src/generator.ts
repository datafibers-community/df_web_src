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
        2. EXPLAIN VIA CODE & DIAGRAMS: Use tables, detailed code snippets, configuration examples (YAML, JSON, XML), and CLI command walk-throughs to explain concepts. 
        3. Use technical terminology correctly and explain complex concepts through analogies if needed.
        
        BANNER IMAGE REQUIREMENTS:
        Your "imagePrompt" must describe a SIMPLE and EASY-TO-UNDERSTAND flat-vector illustration.
        LAYOUT: The illustration should be designed for a horizontal widescreen banner layout.
        STYLE: Use a friendly "Isotype" or "Lottie" vector-art aesthetic. Avoid abstract concepts, photographic realism, or 3D renders. 
        VISUALS: Use recognizable and "cute" objects or characters related to the topic (e.g., a friendly robot, a happy-looking computer, a cute owl for learning, simple colored gears with faces).
        COLOR PALETTE: Use vibrant, clean, and optimistic colors.
        SCENE: Describe a clear, centered subject with no more than 2-3 recognizable objects".
        BACKGROUND: Keep it very simple, solid color or with a very light, friendly pattern (like soft dots or clouds).
        
        FORMATTING RULES:
        1. Follow Hugo markdown standards.
        2. Do not include front matter in the content field.
        3. IMPORTANT: Your output is a JSON string. Ensure all special characters in your content (like double quotes, NEWLINES within code blocks, and backslashes) are properly escaped to maintain valid JSON.
      `;

      const prompt = `
        ${basePrompt}
        
        The output must BE ONLY a JSON object with the following structure:
        {
          "title": "A compelling, specific technical title, but not too long",
          "content": "Full markdown content... Example with code:\n\n\`\`\`python\nprint('hello')\n\`\`\`",
          "tags": [${tags.map(t => `"${t}"`).join(', ')}],
          "categories": ["category1"],
          "imagePrompt": "A highly specific, detailed visual description for a professional technical banner image"
        }
        
        CRITICAL RULES:
        1. The "content" field MUST be a single string that follows Hugo markdown format. 
        2. All newlines within the "content" MUST be literal '\n' characters.
        3. All double quotes inside the "content" MUST be escaped as '\"'.
        4. NEVER include unescaped control characters.
        5. CODE BLOCKS: Every single code snippet (python, sql, yaml, etc.) and diagram (mermaid, etc.) MUST be strictly wrapped in triple backticks (\`\`\`) with the language name. 
           Example inside JSON: ... \"content\": \"Here is code:\\n\\n\`\`\`python\\nprint('hi')\\n\`\`\`\\n\" ...
        6. TAGS: Use only the tags provided in the requested structure above.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Clean up optional markdown wrapper if the AI included it 
      // (Using a stricter regex to avoid stripping internal code blocks)
      const cleanedJson = text.replace(/^```json\s*/, '').replace(/\s*```$/, '').trim();
      
      let data;
      try {
        data = JSON.parse(cleanedJson);
      } catch (e) {
        console.warn('Standard JSON parse failed, attempting robust cleanup...');
        // Attempt to fix unescaped newlines which are the most common "bad control character"
        const fixedJson = cleanedJson.replace(/\n/g, '\\n').replace(/\r/g, '\\r');
        try {
            // This is a last-resort approach and might still fail if quotes are broken
            data = JSON.parse(fixedJson);
        } catch (e2) {
            throw new Error(`JSON parsing failed: ${e instanceof Error ? e.message : String(e)}`);
        }
      }

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
  const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true&seed=${Math.floor(Math.random() * 1000000)}`;

  const imageResponse = await axios.get(imageUrl, { responseType: 'stream' });
  const writer = fs.createWriteStream(outputPath);
  imageResponse.data.pipe(writer);

  return new Promise<void>((resolve, reject) => {
    writer.on('finish', () => resolve());
    writer.on('error', reject);
  });
}
