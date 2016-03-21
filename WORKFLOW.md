<iframe src="//giphy.com/embed/JtIMv7cMRUFX2?html5=true" width="480" height="270" frameBorder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>

##Team Workflow##

On master branch

- git pull
- Make a new branch and switch to that branch by running git checkout -b my_feature

On my_feature branch

- Do your changes here
- git add -A and git commit -m "my changes"
- git checkout master

On master branch

- git pull
- git checkout my_feature

On my_feature branch

- git merge master
- RESOLVE ALL CONFLICTS <<< IMPORTANT!
- git add -A and `git commit -m "merged master into my_feature"
- git push origin my_feature

On Github

- Create a pull request
- Assign it to someone to review
- Merge it once the reviewer accepts it

On your local computer

- git checkout master
- On master

- git pull

Repeat the steps
