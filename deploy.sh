rm -rf public
hugo
cd ../datafibers-community.github.io
git pull
cd ../df_web_src
cp -r ../df_web_src/public/* ../datafibers-community.github.io/
git add .
# Commit changes.
msg="rebuilding site `date`"
if [ $# -eq 1 ]
  then msg="$1"
fi
git commit -m "$msg"
git push origin master

