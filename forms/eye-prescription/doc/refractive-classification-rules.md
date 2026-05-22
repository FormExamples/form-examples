# Refractive Classification Rules

Per-eye band tables used by `refractive-rules.ts`. Bands are expressed in
**dioptres (D)** and **minus-cylinder convention**.

## Sphere bands (per eye)

| Class | Sphere range (D) | Rule ID |
| --- | --- | --- |
| Emmetropia | -0.50 ≤ SPH ≤ +0.50 | `R-SPH-EMM-01` |
| Low myopia | -3.00 ≤ SPH ≤ -0.75 | `R-SPH-MYO-LOW-01` |
| Moderate myopia | -6.00 ≤ SPH ≤ -3.25 | `R-SPH-MYO-MOD-01` |
| High myopia | SPH < -6.00 | `R-SPH-MYO-HIGH-01` |
| Low hyperopia | +0.75 ≤ SPH ≤ +2.00 | `R-SPH-HYP-LOW-01` |
| Moderate hyperopia | +2.25 ≤ SPH ≤ +5.00 | `R-SPH-HYP-MOD-01` |
| High hyperopia | SPH > +5.00 | `R-SPH-HYP-HIGH-01` |

## Cylinder bands (per eye)

Cylinder is stored as a negative or zero value (minus-cylinder convention).
The "magnitude" referenced in the table is `abs(cylinder)`.

| Class | Cylinder magnitude (D) | Rule ID |
| --- | --- | --- |
| No astigmatism | < 0.50 | — (no rule fires) |
| Mild astigmatism | 0.50 ≤ |CYL| ≤ 1.00 | `R-CYL-MILD-01` |
| Moderate astigmatism | 1.25 ≤ |CYL| ≤ 2.50 | `R-CYL-MOD-01` |
| High astigmatism | |CYL| > 2.50 | `R-CYL-HIGH-01` |

## Addition (presbyopia) bands

Addition is always **positive** in dioptres. Stored per eye; usually equal.

| Class | Addition (D) | Rule ID |
| --- | --- | --- |
| No presbyopia | < +0.75 | — (no rule fires) |
| Early presbyopia | +0.75 ≤ ADD ≤ +1.50 | `R-ADD-EARLY-01` |
| Established presbyopia | +1.75 ≤ ADD ≤ +2.50 | `R-ADD-EST-01` |
| Advanced presbyopia | ADD > +2.50 | `R-ADD-ADV-01` |

## Patient-level findings

| Finding | Predicate | Rule ID |
| --- | --- | --- |
| Anisometropia | abs(SPH_OD − SPH_OS) > 2.00 D | `R-ANISO-01` |
| Prism present | prism_OD > 0 OR prism_OS > 0 | `R-PRISM-01` |
| Significant change | abs(SPH_now − SPH_prior) > 1.00 D in either eye | `R-CHANGE-01` |

## Complexity composite

Computed last, after the per-eye and patient-level rules above:

```
if any eye has high myopia / hyperopia / astigmatism:
    complexity = complex
elif prism present or anisometropia > 2 D:
    complexity = complex
elif presbyopia present:
    complexity = moderate
elif any eye has moderate myopia / hyperopia / astigmatism:
    complexity = moderate
else:
    complexity = simple
```

The complexity drives a recommended dispensing workflow:

- **Simple** — any qualified dispenser, off-the-shelf lens stock acceptable.
- **Moderate** — qualified dispenser, custom lens cut recommended; consider
  high-index material for hyperopia > +3.00 D or myopia < -3.00 D.
- **Complex** — referred dispensing optician with experience of high
  prescriptions; bespoke lens manufacture; consider thinner / lighter
  high-index material; consider asphericlenses for high powers.

## Source references

- College of Optometrists *Clinical Management Guidelines*: Myopia,
  Hyperopia, Astigmatism, Presbyopia.
- WHO ICD-11 chapter 09 §H52 (Disorders of refraction and accommodation).
- The bands above match the conventional UK community optometry teaching;
  US sources may use slightly different cutoffs (e.g. high myopia at
  -5.00 D rather than -6.00 D).
