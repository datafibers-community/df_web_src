rm -rf public
hugo
cd ../datafibers-community.github.io
git pull
cp -r ../df_web_src/public/* .
git add .
# Commit changes.
msg="rebuilding site `date`"
if [ $# -eq 1 ]
  then msg="$1"
fi
git commit -m "$msg"
git push origin master

