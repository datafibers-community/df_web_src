rm -rf public
hugo
cd ../datafibers-community.github.io
git pull
cp -r ../df_web_src/public/* .
git add .
# Commit changes.
msg="rebuilding site on `date`"
git commit -m "$msg"
#git push origin master
git push origin master
echo "The site update is deployed."
cd ../df_web_src
rm -rf public
git add .
msg="update site source on `date`"
git commit -m "$msg"
git push origin master
echo "The site source is checked in."
