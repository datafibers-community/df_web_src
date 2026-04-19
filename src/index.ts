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

  // Clear previous output to ensure only the fresh post is present
  const contentDir = path.join(config.OUTPUT_DIR, 'content', config.CONTENT_SUBDIR);
  const imageDir = path.join(config.OUTPUT_DIR, 'static', 'img', config.IMAGE_SUBDIR);
  if (fs.existsSync(contentDir)) fs.rmSync(contentDir, { recursive: true, force: true });
  if (fs.existsSync(imageDir)) fs.rmSync(imageDir, { recursive: true, force: true });
  fs.mkdirSync(contentDir, { recursive: true });
  fs.mkdirSync(imageDir, { recursive: true });

  // Pick exactly 1 random tag using modulo operator on a random number
  const tags = config.TAGS.map(t => t.trim()).filter(t => t);
  
  if (tags.length === 0) {
    console.error('No valid tags found. Please check TAGS in .env');
    return;
  }

  const randomIndex = Math.floor(Math.random() * 1000000) % tags.length;
  const selectedTags = [tags[randomIndex]];

  console.log(`Selected tags for this run: ${selectedTags.join(', ')}`);

  await generateForTags(selectedTags);

  console.log('\n--- Finished Generation ---');
}

main();
