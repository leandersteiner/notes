# Reflection

## Reflect.Type

```go
unknown := interface{}
a := 16
unknown = a
```

```go
var a int32 = 42
var b string = "forty two"

typeA := reflect.TypeOf(a)
fmt.Println(typeA) // int32

typeB := reflect.TypeOf(b)
fmt.Println(typeB) // string
```

```go
type T struct {
  A int32
  B string
}

func main() {
  t := T{42, "forty two"}

  typeT := reflect.TypeOf(t)
  fmt.Println(typeT)

  for i := 0; i < typeT.NumField(); i++ {
    field := typeT.Field(i)
    fmt.Println(field.Name, field.Type)
  }
}
```

Output:
```
main.T
A int32
B string
```

```go
package main

import (
	"fmt"
	"reflect"
)

type Adder interface {
	Add(int, int) int
}

type Calculator struct{}

func (c *Calculator) Add(a int, b int) int {
	return a + b
}

func main() {
	var ptrAdder *Adder
	adderType := reflect.TypeOf(ptrAdder).Elem()

	c := Calculator{}

	calcType := reflect.TypeOf(c)
	calcTypePtr := reflect.TypeOf(&c)

	fmt.Println(calcType, calcType.Implements(adderType))
	fmt.Println(calcTypePtr, calcTypePtr.Implements(adderType))
}
```

Output:

```
main.Calculator false
*main.Calculator true
```


```go
package main

import (
	"fmt"
	"reflect"
	"strings"
)

type T struct {
	B int
	C string
}

type S struct {
	C string
	D T
	E map[string]int
}

func printerReflect(offset int, typeOfX reflect.Type) {
	indent := strings.Repeat(" ", offset)
	fmt.Printf("%s %s: %s {\n", indent, typeOfX.Name(), typeOfX.Kind())
	if typeOfX.Kind() == reflect.Struct {
		for i := 0; i < typeOfX.NumField(); i++ {
			innerIndent := strings.Repeat(" ", offset+4)
			f := typeOfX.Field(i)
			if f.Type.Kind() == reflect.Struct {
				printerReflect(offset+4, f.Type)
			} else {
				fmt.Printf("%s %s: %s\n", innerIndent, f.Name, f.Type)
			}
		}
	}
	fmt.Printf("%s }\n", indent)
}

func main() {
	x := S{
		"root",
		T{42, "forty two"},
		make(map[string]int),
	}
	printerReflect(0, reflect.TypeOf(x))
}
```

Output:

```
 S: struct {
    C: string
    T: struct {
        B: int
        C: string
    }
    E: map[string]int
}
```
