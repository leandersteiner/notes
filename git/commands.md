# Git Commands

## Rewrite commit history

```bash
git filter-branch -f --env-filter '
  if [ "$GIT_AUTHOR_NAME" = "<<Original Author Name>>" ]
  then
    export GIT_AUTHOR_NAME="<<New Author Name>>"
    export GIT_AUTHOR_EMAIL="<<New Author Email>>"
  fi
' -- --all
```