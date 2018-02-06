---
layout: post
title: Git Catchup Changes
guid: urn:uuid:0ccb922f-1ea4-4916-ae5e-20130521
category: Blog
tag: git
---
![](/images/gettingStartedGit.jpg)

There are following ways to catch up/revert changes in GIT
#### Catchup changes from remote

1. Pull out from remote again and you __lost all__ of your local changes as well as hisory

        rm -Rf working_folders
        git clone remote_git_address
1. Merge from remote and this __keeps all__ your local changes 

        git pull 
or

        git fetch
        git merge
        

<br>
#### Catchup changes from local commit

1. Roll back all files to the latest commit and you __lost all__ of your local changes not submitted

        git reset --head HEAD
1. Roll back specific files to the latest commit and you __keep all__ of other local changes not submitted

        git checkout HEAD specific_file_name 
1. Roll back all files to the latest commit and you __lost all__ of your local changes not submitted. Hoever, this will submit a new commit as revert

        git revert HEAD


__Note:__

* Git fast forward: It means code commit submmited should be ordered by time. To resolve the "non-fast-forward" error, you can use command 2 or 3. __`git -f push`__ is not recommended since it forces push to remote.

