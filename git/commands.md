# Git Commands

## Rewrite commit history

```bash
git filter-branch -f --env-filter '
  if [ "$GIT_AUTHOR_NAME" = "<<Original Author Name>>" ]
  then
    export GIT_AUTHOR_NAME="<<New Author Email>>"
    export GIT_AUTHOR_EMAIL="<<New Author Email>>"
  fi
' -- --all
```

```
FILTER_BRANCH_SQUELCH_WARNING=1 git filter-branch -f --env-filter '
  if [ "$GIT_COMMITTER_NAME" = "<<Original Author Name>>" ]
  then
      export GIT_COMMITTER_NAME="<<New Author Email>>"
      export GIT_COMMITTER_EMAIL="<<New Author Email>>"
  fi
  if [ "$GIT_AUTHOR_NAME" = "<<Original Author Name>>" ]
  then
      export GIT_AUTHOR_NAME="<<New Author Email>>"
      export GIT_AUTHOR_EMAIL="<<New Author Email>>"
  fi
' -- --all
```