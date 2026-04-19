# DataFibers Blog Bot & Static Site

An AI-powered automated blog generator and Hugo deployment system. 

## 📋 Prerequisites

### 1. Hugo (v0.30.2)
This site uses a legacy theme and **must** be built with Hugo **v0.30.2**. Newer versions of Hugo will not work correctly.

**Ubuntu Installation:**
```bash
wget https://github.com/gohugoio/hugo/releases/download/v0.30.2/hugo_0.30.2_Linux-64bit.deb
sudo dpkg -i hugo_0.30.2_Linux-64bit.deb
```

### 2. Node.js (v18+)
Required for the AI generator bot:
```bash
sudo apt update
sudo apt install nodejs npm
```

## 🚀 Usage & Deployment

The [**`deploy.sh`**](file:///Users/will/Documents/Coding/GitHub/df_web_src/deploy.sh) script handles the full lifecycle: generating content, building the site, and pushing to GitHub.

### Full Deployment (Generate + Build + Push)
```bash
./deploy.sh
```

### Deploy Only (Skip AI Generation)
To rebuild and deploy existing content without generating a new blog post:
```bash
./deploy.sh --no-gen
# OR
./deploy.sh -n
```

## 🤖 AI Blog Bot Features
- **Smart Content**: Generates technical deep-dives using Gemini 2.5/Gemma 3 models.
- **Code & Diagrams**: Strictly enforces triple-backtick formatting for all technical snippets and ASCII/Mermaid diagrams.
- **Minimalist Banners**: Creates non-stretched, minimalist vector-style banners (16:9 ratio) inspired by `k8s01.png`.

## ⚙️ Configuration (.env)
Create a `.env` file based on [**.env.example**](file:///Users/will/Documents/Coding/GitHub/df_web_src/.env.example):
- `GEMINI_API_KEY`: Your Google Gemini API key.
- `TAGS`: Topics for the generator (e.g., `ai,flink`).
- `OUTPUT_DIR`: Staging area for new posts (defaults to `./output`).

## ⏰ Automation (Crontab)
To automate posts every Sunday and Wednesday at 0:10 AM, add this to `crontab -e`:

```cron
10 0 * * 0,3 /path/to/df_web_src/deploy.sh >> /tmp/blog_deploy.log 2>&1
```
