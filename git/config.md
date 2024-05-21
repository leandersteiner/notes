# Basic Git usage

## Getting ready

1. Install git
2. Generate SSH-Key `ssh-keygen -t ed25519`
3. Add SSH-Key to Gitlab/Github
4. Test if it is working `ssh git@github.com`

## Configuring Git

```bash
git config --global user.name "Leander Steiner"
git config --global user.email leandersteiner@yahoo.de
git config --global core.editor vim
git config --global init.defaultbranch main
```

## Create a new Repository

```bash
git init
git remote add origin git@github.com:leandersteiner/notes.git
git add .
git commit -m "First Commit"
git push -u origin main
```

## Specific configs

~/.gitconfig
```
[user]
  name = Leander Steiner
  email = private@email.de
[init]
 defaultbranch = main
[includeIf "gitdir:~/repos/pf/"]
  path = ~/repos/pf/.gitconfig
[includeIf "gitdir:~/repos/uni
  path = ~/repos/uni/.gitconfig
```

/repos/work/.gitconfig

```
[user]
  name = "Leander Steiner"
  "leander.steiner@work.de"
```

/repos/uni/.gitconfig

```
[user]
  name = "Leander Steiner"
  email = "leander.steiner@uni.de"
```
