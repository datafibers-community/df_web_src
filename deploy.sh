#!/bin/bash
set -e # Exit immediately if any command fails

# 1. Automatically detect the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PARENT_DIR="$(dirname "$SCRIPT_DIR")"
REPO_IO_DIR="$PARENT_DIR/datafibers-community.github.io"

# 2. Stay in the script's directory
cd "$SCRIPT_DIR"

# 3. Add common Linux paths for Cron (Hugo, NPM, Git)
export PATH=$PATH:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin

echo "--- Starting Automation Flow in $SCRIPT_DIR ---"

git pull

# 4. Generate new blog post
npm start

# 5. Ensure folders exist and move content
mkdir -p content/blog static/img/banners

if [ -d "output/content/blog" ]; then
    echo "Moving markdown posts..."
    cp -rv output/content/blog/*.md content/blog/
fi

if [ -d "output/static/img/banners" ]; then
    echo "Moving banner images..."
    cp -rv output/static/img/banners/*.jpg static/img/banners/
fi

# 6. Hugo Build
rm -rf public
hugo

# 7. Deployment Logic
if [ -d "$REPO_IO_DIR" ]; then
    echo "Updating GitHub Pages repo at $REPO_IO_DIR..."
    cd "$REPO_IO_DIR"
    git pull
    cp -r "$SCRIPT_DIR/public/"* .
    git add .
    git commit -m "Site rebuild on $(date)"
    git push origin master
else
    echo "WARNING: GitHub Pages directory not found at $REPO_IO_DIR. Skipping push."
fi

# 8. Sync Source
cd "$SCRIPT_DIR"
git add .
git commit -m "Source update on $(date)"
git push origin master

echo "Done! Site update and source are synchronized."
