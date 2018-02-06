---
layout: post
title: Install Jekyll in MacOS
guid: urn:uuid:0ccb922f-1ea4-4916-ae5e-20130527
category: Blog
tag: jekyll
---
In this year, I have changed blog engines I used from blog.com to GitHub. The main reason is avaliability. The blog.com has so frequent downsite time particularlly when I start using it. For the other blog, it is almost blocked by the country firewall. After trying agai and again, I found and started to use blog on GitHub by __[Jekyll](http://jekyllrb.com/)__. ![](http://jekyllrb.com/img/logo-2x.png)

You have to install Jekyll when setting up the blog since the GitHub renders the blog around 2 - 10 minutes late. During the setting up, you cannot wait for such a long time to see many little changes or justify. Once the blog is ready (mainly UI and layout part), you do not need to use Jekyll any more. To write a blog, you only need to write it in to a markdown file and commit it to the post folder in the GitHub repository. It is easy to install in Ubuntu according to the manual in the official site. However, I am a mac user, so I need it in mac. Offical guide does not work well for the MACOS, so I wrote below as how I make Jekyll work in Mac.
<br>
### Installing: XCode
The easiest way to get a hold of XCode is to download from the [Mac App Store](http://itunes.apple.com/us/app/xcode/id448457090?mt=12).
### Installing: Command Line Tools
You need to install Command Line Tools for Xcode to have gcc compilor enabled (This is no good to have such one by default). Open XCode. Open menual `XCode`>>`Open Developer Tool` >>`More Developer Tools`. This will open the webpages of Apple Developer Download Site. Search the name of the tool and install it.

### Installing: Git
Git is not absolutely necessary, as RVM (the next pre-req) is available as a tarball, but Git is so popular to provide the instructions. Download Git [here](http://code.google.com/p/git-osx-installer/) and click the DMG files to complete installation.
### Installing: Ruby Version Manager (RVM)
Again, RVM is not absolutely required but RVM does ensure that you do not jack up your system by overwriting the OS version of Ruby with a newer version. RVM allows multiple versions of Ruby to be installed on a system (in your home directory, .rvm) and makes it super simple to change the active version.
### Installing: Ruby
Next we will install Ruby version 1.9.2. At this time Ruby version 1.8.7 comes with OS X (Lion). Since we installed RVM, this step is easy-peasy.

Lion users: You will need to open the .profile file and add the following line: export CC=/usr/bin/gcc. This sets the default compiler to gcc (alias to version 4.2 in my Mac).

    Open Terminal
    rvm install 1.9.2
    Now that Ruby is installed you can type the following command to use the newer version of Ruby: rvm use 1.9.2
    To verify type: ruby -v
    To make 1.9.2 the default: rvm --default 1.9.2
### Installing Jekyll
Finally the star attraction, Jekyll…which surprisingly is the easiest part. 

    gem install jekyll

Jekyll is now installed and you are capable of creating your own static, text-based website.





