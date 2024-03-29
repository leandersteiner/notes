# Go Monorepos

A repository in Go usually contains a single Go Module.

[Example Repo](https://github.com/flowerinthenight/golang-monorepo) that supports CircleCI & Github Actions.

[Example Repo](https://github.com/eugbyte/go-monorepo) using go workspaces.

[Article](https://levelup.gitconnected.com/go-project-structure-5157f458c520) on one implementation.

## Note on multi-language Monorepos

From what I read multi-language Monorepos are more trouble than they are worth for small to medium sized companies/projects. The most sensible answeres described one repository for every project and one for tying them all together using git submodules. This makes sense for me since I had great success so far managing projects through git submodules. This also makes CI/CD pipelines easy for every project.

## Possible layouts

```
├── libs
│   └── hello
│       ├── go.mod
│       └── main.go
└── services
    ├── one
    │   ├── go.mod
    │   └── main.go
    └── two
        ├── go.mod
        └── main.go
```

[^src1]

I do not think `libs` is a great name for the shared code. I would imagine in my example most of the shared code would be a small custom web framework based on any of the popular routing libraries and all files concerning inter service communication (gRPC/messaging).

Another thing to make sure is that one service cannot import anything from other servies only from the shared code. I would like to be able to easily check this constraint at compile time. If one service depended on code from another we would instantly have [tight coupling between the two services](https://chrisrichardson.net/post/microservices/2020/12/14/designing-loosely-coupled-services.html) which would defeat the purpose of microservices. This would warrant the use of the [internal directory in go](https://go.dev/doc/go1.4#internalpackages).

Every service would have their own Dockerfile and Kubernetes deployment files. For testing I would probably also want a testing Dockerfile for every service as well as a way to run everything inside of docker compose.

## Go local imports

For importing local go modules the [replace directive](https://go.dev/ref/mod?id=go-work-file-replace#go-mod-file-replace) could be used.

```go
module github.com/org/repo/examples/go-monorepo/services/one

go 1.17

require (
  github.com/org/repo/examples/go-monorepo/libs/hello v0.0.0
)

replace github.com/org/repo/examples/go-monorepo/libs/hello v0.0.0 => ../../libs/hello
```
[^src1]

Another [Example](https://passage.id/post/shared-go-packages-in-a-monorepo) for replace.

**Note:** I have not yet looked into go workspaces with `go.work` files enough to know if this would be another viable option for structuring monorepos. It is on my todo list and I will write about it once I did look into it.

> Go recommends using single-module repositories by default, and warns that multi-module repositories require great care.[^src2]

## NX

One of the things that gets recommended a lot is [NX](https://nx.dev/) with the [nx-go plugin](https://github.com/nx-go/nx-go). This looks promising especially since it does support multiple other languages and frameworks.

[^src1]: [https://earthly.dev/blog/golang-monorepo/](https://earthly.dev/blog/golang-monorepo/)
[^src2]: [https://medium.com/grab/go-modules-a-guide-for-monorepos-part-1-dbc5fc8217ec](https://medium.com/grab/go-modules-a-guide-for-monorepos-part-1-dbc5fc8217ec)
