---
layout: post
title: GIT Tips At Weekend - Sunday
category: Blog
excerpt: This is a short tutorial for reviewinf git during Sunday
guid: urn:uuid:0ccb922f-1ea4-4916-ae5e-20130519
tag: git

---
![](/images/gitwk.jpg)

#### Cherry-Picking
--------------

	git cherry-pick [--edit] [-n] [-m parent-number] [-s] [-x] <commit>
Selectively merge a single commit from another local branch<br>
Example: `git cherry-pick 7300a6130d9447e18a931e898b64eefedea19544`
<br>
<br>

#### Squashing
---------
*WARNING*: "git rebase" changes history. Be careful. Google it.

	git rebase --interactive HEAD~10
(then change all but the first "pick" to "squash")
squash the last 10 commits into one big commit

<br>
<br>
#### Conflicts
---------
	git mergetool
Work through conflicted files by opening them in your mergetool (opendiff,
kdiff3, etc.) and choosing left/right chunks. The merged result is staged for
commit.

For binary files or if mergetool won't do, resolve the conflict(s) manually
and then do:`git add <file1> [<file2> …]` Once all conflicts are resolved and staged, commit the pending merge with: `git commit`

<br>
<br>
#### Sharing
-------

	git fetch <remote>
Update the remote-tracking branches for \<remote> (defaults to "origin").
Does not initiate a merge into the current branch (see "git pull" below).

	git pull
Fetch changes from the server, and merge them into the current branch.
Note: .git/config must have a [branch "some_name"] section for the current
branch, to know which remote-tracking branch to merge into the current
branch. Git 1.5.3 and above adds this automatically.

	git push
Update the server with your commits across all branches that are *COMMON*
between your local copy and the server. Local branches that were never
pushed to the server in the first place are not shared.

	git push origin <branch>
Update the server with your commits made to \<branch> since your last push.
This is always *required* for new branches that you wish to share. After
the first explicit push, "git push" by itself is sufficient.

	git push origin <branch>:refs/heads/<branch>
E.g. git push origin twitter-experiment:refs/heads/twitter-experiment
Which, in fact, is the same as `git push origin <branch>` but a little
more obvious what is happening.

<br>
<br>
#### Reverting
---------

	git revert <rev>
Reverse commit specified by \<rev> and commit the result. This does *not* do
the same thing as similarly named commands in other VCS's such as "svn
revert" or "bzr revert", see below

	git checkout <file>
Re-checkout \<file>, overwriting any local changes

	git checkout .
Re-checkout all files, overwriting any local changes. This is most similar
to "svn revert" if you're used to Subversion commands
<br>
<br>
#### Fix Mistakes / Undo
-------------------

	git reset --hard
Abandon everything since your last commit; this command can be DANGEROUS.
If merging has resulted in conflicts and you'd like to just forget about
the merge, this command will do that.

	git reset --hard ORIG_HEAD
Undo your most recent *successful* merge *and* any changes that occurred
after. Useful for forgetting about the merge you just did. If there are
conflicts (the merge was not successful), use `git reset --hard` (above)
instead.

	git reset --soft HEAD^
Forgot something in your last commit? That's easy to fix. Undo your last
commit, but keep the changes in the staging area for editing.

	git commit --amend
Redo previous commit, including changes you've staged in the meantime.
Also used to edit commit message of previous commit.
<br>
<br>
#### Plumbing
--------

	test <sha1-A> = $(git merge-base <sha1-A> <sha1-B>)
Determine if merging sha1-B into sha1-A is achievable as a fast forward;
non-zero exit status is false.
<br>
<br>
#### Stashing
--------
	git stash
	git stash save <optional-name>
Save your local modifications to a new stash (so you can for example
"git svn rebase" or "git pull")

	git stash apply
Restore the changes recorded in the stash on top of the current working tree
state

	git stash pop
Restore the changes from the most recent stash, and remove it from the stack
of stashed changes

	git stash list
List all current stashes

	git stash show <stash-name> -p
Show the contents of a stash - accepts all diff args

	git stash drop [<stash-name>]
Delete the stash

	git stash clear
Delete all current stashes
<br>
<br>
#### Remotes
-------
	
	git remote add <remote> <remote_URL>
Adds a remote repository to your git config. Can be then fetched locally.<br>
Example:
	git remote add coreteam git://github.com/wycats/merb-plugins.git
	git fetch coreteam

	git push <remote> :refs/heads/<branch>
Delete a branch in a remote repository

	git push <remote> <remote>:refs/heads/<remote_branch>
Create a branch on a remote repository
Example: git push origin origin:refs/heads/new_feature_name

	git push <repository> +<remote>:<new_remote>
Replace a \<remote> branch with \<new_remote>
think twice before do this<br>
Example: 
	git push origin +master:my_branch

	git remote prune <remote>
Prune deleted remote-tracking branches from `git branch -r` listing

	git remote add -t master -m master origin git://example.com/git.git/
Add a remote and track its master

	git remote show <remote>
Show information about the remote server.

	git checkout -b <local branch> <remote>/<remote branch>
Eg git checkout -b myfeature origin/myfeature
Track a remote branch as a local branch.

	git pull <remote> <branch>
	git push
For branches that are remotely tracked (via git push) but
that complain about non-fast forward commits when doing a
git push. The pull synchronizes local and remote, and if
all goes well, the result is pushable.

	git fetch <remote>
Retrieves all branches from the remote repository. After
this `git branch --track ...` can be used to track a branch
from the new remote.

<br>
<br>
#### Submodules
----------

	git submodule add <remote_repository> <path/to/submodule>
Add the given repository at the given path. The addition will be part of the
next commit.

	git submodule update [--init]
Update the registered submodules (clone missing submodules, and checkout
the commit specified by the super-repo). --init is needed the first time.

	git submodule foreach <command>
Executes the given command within each checked out submodule.

Removing submodules

1. Delete the relevant line from the .gitmodules file.
2. Delete the relevant section from .git/config.
3. Run git rm --cached path_to_submodule (no trailing slash).
4. Commit and delete the now untracked submodule files.

Updating submodules
To update a submodule to a new commit:

1. update submodule:<br>
	`cd <path to submodule>`<br>
	`git pull`

2. commit the new version of submodule:<br>
	`cd <path to toplevel>`<br>
	`git commit -m "update submodule version"`
3. check that the submodule has the correct version<br>
`git submodule status`<br>
If the update in the submodule is not committed in the
main repository, it is lost and doing git submodule
update will revert to the previous version.

<br>
<br>
#### Patches
-------

	git format-patch HEAD^
Generate the last commit as a patch that can be applied on another
clone (or branch) using 'git am'. Format patch can also generate a
patch for all commits using 'git format-patch HEAD^ HEAD'
All page files will be enumerated with a prefix, e.g. 0001 is the
first patch.

	git format-patch <Revision>^..<Revision>
Generate a patch for a single commit. E.g.
git format-patch d8efce43099^..d8efce43099
Revision does not need to be fully specified.

	git am <patch file>
Applies the patch file generated by format-patch.

	git diff --no-prefix > patchfile
Generates a patch file that can be applied using patch:
	patch -p0 < patchfile
Useful for sharing changes without generating a git commit.

<br>
<br>
#### Tags
----

	git tag -l
Will list all tags defined in the repository.

	git co <tag_name>
Will checkout the code for a particular tag. After this you'll
probably want to do: `git co -b <some branch name>` to define
a branch. Any changes you now make can be committed to that
branch and later merged.

<br>
<br>
#### Git Instaweb
------------

	git instaweb --httpd=webrick [--start | --stop | --restart]

<br>
<br>
####Environment Variables
---------------------

	GIT_AUTHOR_NAME, GIT_COMMITTER_NAME
Your full name to be recorded in any newly created commits. Overrides
user.name in .git/config

	GIT_AUTHOR_EMAIL, GIT_COMMITTER_EMAIL
Your email address to be recorded in any newly created commits. Overrides
user.email in .git/config

	GIT_DIR
Location of the repository to use (for out of working directory repositories)

	GIT_WORKING_TREE
Location of the Working Directory - use with GIT_DIR to specifiy the working
directory root
or to work without being in the working directory at all.
