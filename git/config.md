# Basic Git usage

## Getting ready

1. Install git
2. Generate SSH-Key

```bash
$ ssh-keygen -t ed25519
```

3. Add SSH-Key to Gitlab/Github
4. Test if it is working

```bash
$ ssh git@github.com
```

## Configuring Git

```bash
$ git config --global user.name "Leander Steiner"
$ git config --global user.email leandersteiner@yahoo.de
$ git config --global core.editor vim
$ gir config --global init.defaultbranch main
```

## Create a new Repository

```bash
$ git init
$ git remote add origin git@github.com:leandersteiner/notes.git
$ git add .
$ git commit -m "First Commit"
$ git push -u origin main
```
