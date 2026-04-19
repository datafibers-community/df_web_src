# DataFibers Blog Bot

An AI-powered automated blog generator that creates technical posts and banner images using Google Gemini and Pollinations.ai.

## Features
- **Smart Content**: Generates technical blog posts using `gemini-flash-latest`.
- **Free Images**: Creates unique banner images via Pollinations.ai (no API key required).
- **Flexible Topics**: Picks 1-2 random tags from your list for every run.
- **Single Output**: Generates exactly one post per execution.

## Deployment to Ubuntu

### 1. Prerequisites
Ensure you have Node.js (v18+) and npm installed on your Ubuntu server:
```bash
sudo apt update
sudo apt install nodejs npm
```

### 2. Upload Files
Upload the following to your server:
- `src/`
- `package.json`
- `.env`
- `tsconfig.json`

### 3. Setup
```bash
# Install dependencies
npm install
```

### 4. Running
To run the bot manually:
```bash
npm start
```

### 5. Automation (Cron Job)
To automate the generator (e.g., run every morning at 9:00 AM), add a entry to your crontab:

1. Open crontab: `crontab -e`
2. Add the following line (replace `/path/to/` with your actual project path):
```bash
0 9 * * * cd /path/to/df_blog_bot && /usr/bin/npm start >> /path/to/df_blog_bot/cron.log 2>&1
```

## Configuration (.env)
- `GEMINI_API_KEY`: Your Google Gemini API key.
- `TAGS`: Comma-separated list of topics (e.g., `ai,data-engineering,kafka`).
- `BLOG_PROMPT`: (Optional) Custom instructions for the AI writer.
- `OUTPUT_DIR`: (Optional) Where to save the generated markdown and images.
