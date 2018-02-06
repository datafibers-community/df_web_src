title: Get Git Modified But Untracked Content Checked In
date: 2015-08-21 11:27:57
tags: git
category: 
  - Blog
---
![](/images/gettingStartedGit.jpg)
Recently, I migrate this site to Hexo. I download the theme from github to the Hexo project folder. I also keep the source code in the github in case I lost the source code. However, when I run the `git add . ` and `git status`. It shows below error messages saying the theme folder is not tracked content. Most time, I did not check the git status - bad habit. I only realize that I miss the theme files when I try to rebuild the Hexo site from home.
![](/images/gituntracked.png)
After searching a while form Google, I got my issues resolved and share the steps below for reference.

* Removed the .git directories from the directories (In my case, ../theme/hueman/.git)
* Ran git rm -rf --cached <the untracked directory> (In my case, /C/Users/ddu/Git/sparkera/themes/hueman)
* Re-added the directories with a `git add . ` and check by `git status`.

Then all the untracked files are added. Then you can do `git commit -m ` and `git push` the submit all the changes.
