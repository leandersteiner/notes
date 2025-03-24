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

## Generate Slides

```
pandoc -t revealjs -s slides.md --standalone -o slides.html --include-in-header=style.html
```

```html
<style>
.slides {
  font-size: 0.75em;
}
.reveal ul {
  display: block;
}
.reveal ol {
  display: block;
}

img {
  max-height: 100% !important;
}

figcaption {
  font-size: 0.6em !important;
  font-style: italic !important;
}

.subtitle {
  font-style: italic !important;
}

.date {
  font-size: 0.75em !important;
}

code {
  background-color: #ffffff;
  border: 1px solid #aaaaaa;
  box-shadow: none;
  max-height: 100% !important;
}

.reveal pre {
  box-shadow: none;
}

pre.numberSource {
  border-left: none !important;
}

pre > code.sourceCode > span > a:first-child::before {
  text-decoration: none;
}
</style>
```

```md
---
title: Microservices
author: Leander Steiner
date: 29.11.2022
transition: fade
theme: white
width: 1200
---

# Minimal DDD and Architecture

## Ingredients of effective modeling

1. Binding the model and the implementation
2. Cultivating a language based on the model
3. Developing a knowledge-rich model
4. Distilling the model
5. Brainstorming and experimenting

## Domains

- an area of expertise
- the area in which a software operates
- what an organization does and the world it does it in
- the knowledge space around the problems a software is designed to solve
- software developers have expertise in the domain of software development
- business problems cannot be solved with solution that exclusively belon to technological domains

## Subdomains

- distinguishable knowledge areas that are part of a larger compound
- core domain
  - area most relevant to the problems a software aims to solve
- supporting subdomain
  - combination of generic knowledge and problem-specific aspects
- generic subdomain
  - universal knowledge that is not specific to the main problem

## Definition of terms

- Domain
  - Knowledge area around a problem
- Domain Model
  - Structured abstraction of Domain knowledge
- Domain Model implementation
  - Software solution based on a Domain Model

## Bounded Contexts

- explicit boundary in whithin which a Domain Model exists
- intention to unify a model within certain boundaries

## Software Architecture

- **Domain**: Implementation of the Domain Model
- **Infrastructure**: Technical functionality with optional external dependencies
- **Application**: Use case execution, management of transaction and security
- **UI**: Interaction with the software

---
```
