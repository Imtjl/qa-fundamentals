## Maths behind this bs

$$
\begin{cases}
\left( \left( csc(x) - sec(x)\right) - cos(x) \right) & \text{if } x \leq 0 \\
\left( \frac{ \left( \log_5(x) - \ln(x) \right)^4 \cdot \left( \log_5(x) + \log_3(x) \right)^3 }{\log_{10}(x) \cdot ln(x)} \right) & \text{if } x > 0
\end{cases}
$$

## Class diagram

```mermaid
classDiagram
    class factorial {
        +factorial(n: number): number
    }

    class taylorSin {
        +taylorSin(x: number, terms: number): number
    }

    class taylorCos {
        +taylorCos(x: number, terms: number): number
    }

    class taylorTan {
        +taylorTan(x: number, terms: number): number
    }

    class taylorExp {
        +taylorExp(x: number, terms: number): number
    }

    class taylorLn {
        +taylorLn(x: number, terms: number): number
    }

    class taylorSqrt {
        +taylorSqrt(x: number, terms: number): number
    }

    class taylorLog {
        +taylorLog(x: number, terms: number): number
    }

    class taylorSec {
        +taylorSec(x: number, terms: number): number
    }

    class taylorCsc {
        +taylorCsc(x: number, terms: number): number
    }

    class systemFunction {
        +systemFunction(x: number, terms: number): number
    }

    factorial <-- taylorSin : uses
    factorial <-- taylorExp : uses
    factorial <-- taylorLn : uses

    taylorSin <-- taylorCos : uses
    taylorSin <-- taylorTan : uses
    taylorSin <-- taylorCsc : uses

    taylorCos <-- taylorTan : uses
    taylorCos <-- taylorSec : uses

    taylorLn <-- taylorSqrt : uses
    taylorLn <-- taylorLog : uses
    taylorExp <-- taylorSqrt : uses

    taylorCsc <-- systemFunction : uses when x ≤ 0
    taylorSec <-- systemFunction : uses when x ≤ 0
    taylorCos <-- systemFunction : uses when x ≤ 0

    taylorLn <-- systemFunction : uses when x > 0
    taylorLog <-- systemFunction : uses when x > 0
```
