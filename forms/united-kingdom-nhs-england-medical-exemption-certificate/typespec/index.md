# UK NHS England Medical Exemption Certificate (FP92A) — TypeSpec

[TypeSpec](https://typespec.io/) models that mirror the SQL schema in
`../sql/`. The single `main.tsp` file declares the `Fp92a` namespace
with one model per SQL table — `Patient`, `Practitioner`, `EligibleCondition`,
`Application`, `ApplicationEligibleCondition`, `Grade`, `GradeFiredRule`,
`GradeAdditionalFlag`.

TypeSpec primitives are used directly (`string`, `int32`, `float64`,
`plainDate`, `utcDateTime`); SQL `CHECK` constraints become union string
literals.
