# Numerik

## Einleitung

Numerical Recipes

## Sprachen

### Fortran

- altehrwürdig
- gut
- viel verwendet
- schnell
  - Gute Optimierer
  - Eingebaute Operatoren
    ```fortran
    (a+b)**4
    ```
  - Eingebaute Datentpypen wie Matrix, Vektor, etc.
- Es gibt viel Fortran-Software
- Indizierung bei Vektoren beginnt standardmäßig bei 1
- Matrizen werden spaltenweise abgespeichert

### C

Für andere Zwecke konzipiert. Für Numerik nicht so gut geeignet.

- Keine Exponentiation
- Implizite Typkonversion
- Keinen Matrix-Datentyp

### C++

Besser als C geeignet:

- Wrapper zu C vorhanden/machbar
- In Standardbibliothek Datentypen für Numerik

  - dynamischies Array

    - in c:
      ```c
      double *a = (double*)malloc(...);
      free(a)
      ```
    - in c++:

      ```c++
      vector<double>
      ```

      - bequen
      - allgemein

      ```c++
      valarry<double>
      ```

      - nicht so allgemein
      - für schnelle Numerik optimierbar

  - Hilfsklassen (slice, ...)
  - Algorithmen
  - Keine Matrixklasse!

- Java, Python -> alle mehr oder weniger gut für Numerik geeignet

## Compiler- & Prozessoreigenschaften

### Genauigkeit

#### Darstellung typischer Datentypen

##### Integer(signed, unsigned, int, ...)

Arithmetik exakt, solange Darstellungsbereich nicht verlassen wird und nur Integer-Division durchgeführt wird.

##### Gleitkomma-Zahlen(float, double)

z.B.:

- 1 Bit Vorzeichen s
- 8 Bit Exponenten e (Basis b=2)
- 23 Bit Mantisse M

=> `x = s * M * b ^ (e - E)` E: "Bias" im Exponent

=> Darstellunggenauigkeit des Prozessors ist beschränkt

- Welches ist der kleinste Wert (Epsilon index m), der zu 1.0 addiert etwas ungleich 1.0 liefert?

```
 10..0
+00..01 // zu klein um darzustellen
```

```js
let x = 1.0;

while (1.0 + x != 1.0) {
  x *= 0.5;
}

console.log(x);
```

- Betragsmäßig kleinste darstellbare Zahl != 0.0

```js
let x = 1.0;

while (0.0 + x != 0.0) {
  x *= 0.5;
}

console.log(x);
```

Verwendete Werte des C-Compilers durch `#include` abfragbar

- `limits.h` integer
- `float.h` float, double, ...
