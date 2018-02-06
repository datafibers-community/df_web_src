---
layout: post
title: GIT Tips At Weekend - Saturday
category: Blog
guid: urn:uuid:0ccb922f-1ea4-4916-ae5e-20130518
tag: git
---
![](/images/gitwk.jpg)

#### Info
----
	git reflog
Use this to recover from __*major*__ fuck ups! It's basically a log of the
last few actions and you might have luck and find old commits that
have been lost by doing a complex merge.

	git diff
Show a diff of the changes made since your last commit
to diff one file: `git diff -- \<filename>`
to show a diff between staging area and HEAD: `git diff --cached`

	git status
Show files added to the staging area, files with changes, and untracked files

	git log
Show recent commits, most recent on top. Useful options:

* --color with color
* --graph with an ASCII-art commit graph on the left
* --decorate with branch and tag names on appropriate commits
* --stat with stats (files changed, insertions, and deletions)
* -p with full diffs
* --author=foo only by a certain author
* --after="MMM DD YYYY" ex. ("Jun 20 2008") only commits after a certain date
* --before="MMM DD YYYY" only commits that occur before a certain date
* --merge only the commits involved in the current merge conflicts

<br>
	git log <ref>..<ref>
Show commits between the specified range. 
	
	git log HEAD..origin/master # 
Useful for seeing changes from remotes after git remote update

	git show <rev>
Show the changeset (diff) of a commit specified by \<rev>, which can be any
SHA1 commit ID, branch name, or tag (shows the last commit (HEAD) by default)

	git show --name-only <rev>
Show only the names of the files that changed, no diff information.

	git blame <file>
Show who authored each line in "file"

	git blame <file> <rev>
Show who authored each line in \<file> as of \<rev> (allows blame to go back in
time)

	git gui blame
Really nice GUI interface to git blame

	git whatchanged <file>
Show only the commits which affected \<file> listing the most recent first
E.g. view all changes made to a file on a branch:
	git whatchanged <branch> <file> | grep commit | colrm 1 7 | xargs -I % git show % <file>
This could be combined with git remote show \<remote> to find all changes on
all branches to a particular file.

	git diff <commit> head path/to/fubar
Show the diff between a file on the current branch and potentially another
branch

	git diff head -- <file>
Use this form when doing git diff on cherry-pick'ed (but not committed) changes somehow changes are not shown when using just git diff.

	git ls-files
List all files in the index and under version control.
	
	git ls-remote <remote> [HEAD]
Show the current version on the remote repo. This can be used to check whether
a local is required by comparing the local head revision.

<br>
<br>
#### Adding / Deleting
-----------------

	git add <file1> <file2> ...
Add \<file1>, \<file2>, etc... to the project

	git add <dir>
Add all files under directory \<dir> to the project, including subdirectories

	git add .
Add all files under the current directory to the project
*WARNING*: including untracked files.

	git rm <file1> <file2> ...
Remove \<file1>, \<file2>, etc... from the project

	git rm $(git ls-files --deleted)
Remove all deleted files from the project

	git rm --cached <file1> <file2> ...
Commits absence of \<file1>, \<file2>, etc... from the project
<br>
<br>
#### Ignoring
---------

* __Option 1__: Edit $GIT_DIR/info/exclude. See Environment Variables below for explanation on
$GIT_DIR.

* __Option 2__: Add a file .gitignore to the root of your project. This file will be checked in.

Either way you need to add patterns to exclude to these files.
<br>
<br>
#### Staging
-------

	git add <file1> <file2> ...
	git stage <file1> <file2> ...
Add changes in \<file1>, \<file2> ... to the staging area to be included in the next commit

	git add -p
	git stage --patch
Interactively walk through the current changes (hunks) in the working tree, and decide which changes to add to the staging area.

	git add -i
	git stage --interactive
Interactively add files/changes to the staging area. For a simpler mode (no menu), try `git add --patch` (above)
<br>
<br>

#### Unstaging
---------
	git reset HEAD <file1> <file2> ...
Remove the specified files from the next commit
<br>
<br>
#### Committing
----------

	git commit <file1> <file2> ... [-m <msg>]
Commit \<file1>, \<file2>, etc..., optionally using commit message \<msg>, otherwise opening your editor to let you type a commit message

	git commit -a
Commit all files changed since your last commit
(does not include new (untracked) files)

	git commit -v
Commit verbosely, i.e. includes the diff of the contents being committed in the commit message screen
	
	git commit --amend
Edit the commit message of the most recent commit

	git commit --amend <file1> <file2> ...
Redo previous commit, including changes made to \<file1>, <file2>, etc...
<br>
<br>

#### Branching
---------
	git branch
List all local branches

	git branch -r
List all remote branches

	git branch -a
List all local and remote branches

	git branch <branch>
Create a new branch named \<branch>, referencing the same point in history as the current branch

	git branch <branch> <start-point>
Create a new branch named \<branch>, referencing \<start-point>, which may be
specified any way you like, including using a branch name or a tag name

	git push <repo> <start-point>:refs/heads/<branch>
Create a new remote branch named <branch>, referencing <start-point> on the
remote.<br>
Example: `git push origin origin:refs/heads/branch-1`<br>
Example: `git push origin origin/branch-1:refs/heads/branch-2`

	git branch --track <branch> <remote-branch>
Create a tracking branch. Will push/pull changes to/from another repository.<br>
Example: `git branch --track experimental origin/experimental`

	git branch -d <branch>
Delete the branch \<branch>; if the branch you are deleting points to a
commit which is not reachable from the current branch, this command
will fail with a warning.

	git branch -r -d <remote-branch>
Delete a remote-tracking branch.
Example: `git branch -r -d wycats/master`

	git branch -D <branch>
Even if the branch points to a commit not reachable from the current branch,
you may know that that commit is still reachable from some other branch or
tag. In that case it is safe to use this command to force git to delete the
branch.

	git checkout <branch>
Make the current branch \<branch>, updating the working directory to reflect
the version referenced by \<branch>

	git checkout -b <new> <start-point>
Create a new branch <new> referencing \<start-point>, and check it out.

	git push <repository> :<branch>
Removes a branch from a remote repository.<br>
Example: `git push origin :old_branch_to_be_deleted`
	
	git co <branch> <path to new file>
Checkout a file from another branch and add it to this branch. File
will still need to be added to the git branch, but it's present.<br>
Eg. `git co remote_at_origin__tick702_antifraud_blocking
…./...nt_elements_for_iframe_blocked_page.rb`

	git show <branch> -- <path to file that does not exist>
Eg. `git show remote_tick702 -- path/to/fubar.txt`<br>
Show the contents of a file that was created on another branch and that
does not exist on the current branch.

	git show <rev>:<repo path to file>
Show the contents of a file at the specific revision. 

__Note__: path has to be absolute within the repo.
<br>
<br>

#### Merging
-------
	git merge <branch>
Merge branch \<branch> into the current branch; this command is idempotent
and can be run as many times as needed to keep the current branch
up-to-date with changes in <branch>

	git merge <branch> --no-commit
Merge branch \<branch> into the current branch, but do not autocommit the
result; allows you to make further tweaks

	git merge <branch> -s ours
Merge branch \<branch> into the current branch, but drops any changes in
\<branch>, using the current tree as the new tree
<br>
<br>
![](http://kandishengcdn.sinaapp.com/wp-content/uploads/2012/05/687474703a2f2f6769746875622e73332e616d617a6f6e6177732e636f6d2f626c6f672f7265642d706f6c6f2e6a7067.jpg)
