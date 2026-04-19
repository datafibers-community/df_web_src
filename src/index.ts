import { config } from './config';
import { generateBlogPost, generateBannerImage } from './generator';
import path from 'path';
import fs from 'fs';

async function generateForTags(tags: string[]) {
  console.log(`\n--- Working on tags: ${tags.join(', ')} ---`);

  try {
    // 1. Generate Blog Content (Single post for all tags)
    console.log('Phase 1: Generating blog content...');
    const post = await generateBlogPost(tags);
    console.log(`Generated post: ${post.title}`);

    // 3. Save Files
    const contentDir = path.join(config.OUTPUT_DIR, 'content', config.CONTENT_SUBDIR);
    const imageDir = path.join(config.OUTPUT_DIR, 'static', 'img', config.IMAGE_SUBDIR);

    if (!fs.existsSync(contentDir)) fs.mkdirSync(contentDir, { recursive: true });
    if (!fs.existsSync(imageDir)) fs.mkdirSync(imageDir, { recursive: true });

    // 2. Save Banner Image
    const imagePath = path.join(imageDir, post.imageFilename);
    await generateBannerImage(post.imagePrompt, imagePath);
    console.log(`Saved banner image to ${imagePath}`);
    // 3. Save Markdown
    const tomlFrontMatter = '+++\n' + Object.entries(post.frontMatter)
      .map(([k, v]) => `${k} = ${JSON.stringify(v)}`)
      .join('\n') + '\n+++\n';

    const fullContent = tomlFrontMatter + '\n' + post.content;
    const postFilename = `${post.frontMatter.date}-${post.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, '')}.md`;
    const postPath = path.join(contentDir, postFilename);
    
    fs.writeFileSync(postPath, fullContent);
    console.log(`Saved post to ${postPath}`);

  } catch (error) {
    console.error(`Error generating post for tags ${tags.join(', ')}:`, error);
  }
}

async function main() {
  console.log('--- Starting Standalone AI Blog Generator ---');
  console.log(`Target Output Directory: ${config.OUTPUT_DIR}`);

  if (config.TAGS.length === 0) {
    console.error('No tags configured. Please set TAGS in .env');
    return;
  }

  // Shuffle and pick 1-2 random tags to generate for in a SINGLE post
  const shuffled = [...config.TAGS].sort(() => 0.5 - Math.random());
  const count = Math.random() < 0.5 ? 1 : 2;
  const selectedTags = shuffled.slice(0, Math.min(count, shuffled.length)).map(t => t.trim());

  console.log(`Selected tags for this run: ${selectedTags.join(', ')}`);

  await generateForTags(selectedTags);

  console.log('\n--- Finished Generation ---');
}

main();
