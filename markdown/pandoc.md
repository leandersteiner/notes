# Pandoc

## Header for formatting

```yaml
---
title: Gateway package documentation
author: Leander Steiner
date: \today
toc: true
monofont: "Hack Nerd Font"
fontsize: 11pt
linestretch: 1.5
numbersections: true
documentclass: scrarticle
geometry:
- top=30mm
- bottom=25mm
- left=25mm
- right=20mm
indent: true
pagestyle: empty
papersize: a4
colorlinks: true
header-includes:
- \usepackage{fvextra}
- \DefineVerbatimEnvironment{Highlighting}{Verbatim}{fontsize=\small,breaklines,commandchars=\\\{\}}
---
```

## Code blocks with highlighting and line numbers

```{.numberLines .go}
func validateToken(token []byte) (*jwt.Claims, error) {
  // check if we signed the token and either
  // return an error or the claims inside the jwt
  claims, err := jwt.HMACCheck(token, secret)
  if err != nil {
    return nil, err
  }
  return claims, nil
}
```

## Command

```
pandoc --pdf-engine xelatex  gateway.md -o gateway.pdf --highlight-style tango
```

## Extra.tex

- makes sure figures are not displayed out of flow

```
\usepackage{fvextra}
\DefineVerbatimEnvironment{Highlighting}{Verbatim}{fontsize=\small,breaklines,commandchars=\\\{\}}
\usepackage{float}
\let\origfigure\figure
\let\endorigfigure\endfigure
\renewenvironment{figure}[1][2] {
    \expandafter\origfigure\expandafter[H]
} {
    \endorigfigure
}
```

## Generate pdfs

```
#!/bin/bash

for file in *.md
do
  pandoc -H extra.tex --pdf-engine xelatex  "$file" -o "${file%.*}.pdf" --shift-heading-level-by=-1 --highlight-style tango
done
```
