---
layout: post
title: GIT Tips At Weekend - Friday
category: Blog
guid: urn:uuid:0ccb922f-1ea4-4916-ae5e-20130517
tag: git

---
![](/images/gitwk.jpg)

#### Git Setup
-----
##### Git Clone

    git clone [repo]
clone the repository specified by [repo]. It defaully run `git init` and `git remote add origin [repo]`

##### Add colors by setting ~/.gitconfig file:
	[color]
    ui = auto
	[color "branch"]
	current = yellow reverse
	local = yellow
	remote = green
	[color "diff"]
	meta = yellow bold
	frag = magenta bold
	old = red bold
	new = green bold
	[color "status"]
	added = yellow
	changed = green
	untracked = cyan

##### Highlight whitespace in diffs by setting ~/.gitconfig file:

	[color]
	ui = true
	[color "diff"]
	whitespace = red reverse
	[core]
	whitespace=fix,-indent-with-non-tab,trailing-space,cr-at-eol

##### Add aliases by setting ~/.gitconfig file:

	[alias]
	st = status
	ci = commit
	br = branch
	co = checkout
	df = diff
	dc = diff --cached
	lg = log -p
	lol = log --graph --decorate --pretty=oneline --abbrev-commit
	lola = log --graph --decorate --pretty=oneline --abbrev-commit --all
	ls = ls-files

##### Show files ignored by git by setting ~/.gitconfig file:
ign = ls-files -o -i --exclude-standard

<br>
<br>

#### Configuration
-------------
	git config -e [--global]
Edit the .git/config [or ~/.gitconfig] file in your $EDITOR
	git config --global user.name 'John Doe'
	git config --global user.email johndoe@example.com
Sets your name and email for commit messages

	git config branch.autosetupmerge true
Tells `git-branch` and `git-checkout` to setup new branches so that `git-pull(1)`
will appropriately merge from that remote branch. Recommended. Without this,
you will have to add `--track` to your branch command or manually merge remote
tracking branches with "fetch" and then "merge".

	git config core.autocrlf true
This setting tells git to convert the newlines to the system’s standard
when checking out files, and to LF newlines when committing in

_Note: You can add `--global` after `git config` to any of these commands to make it
apply to all git repos (writes to ~/.gitconfig)._
<br>
<br>
![](http://kandishengcdn.sinaapp.com/wp-content/uploads/2012/05/687474703a2f2f6769746875622e73332e616d617a6f6e6177732e636f6d2f626c6f672f7265642d706f6c6f2e6a7067.jpg)
