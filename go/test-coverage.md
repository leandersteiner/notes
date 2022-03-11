# Test coverage in Go

[Sharon Katz](https://stackoverflow.com/a/51634670)

```
go test -v -coverprofile cover.out ./YOUR_CODE_FOLDER/...
go tool cover -html=cover.out -o cover.html
open cover.html
```

```
go test -cover
```
