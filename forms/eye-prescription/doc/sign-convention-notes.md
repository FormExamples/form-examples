# Sign Convention Notes

## Sphere

- **Negative** sphere corrects **myopia** (short sight).
- **Positive** sphere corrects **hyperopia** (long sight).
- **Zero** sphere indicates the eye is emmetropic at distance.

The UK and US both use this convention; there is no regional variation
for sphere.

## Cylinder — the central convention question

Cylinder describes the **astigmatic** component of a refraction. It is
mathematically symmetric: a "-1.00 × 90" prescription is identical in
optical effect to a "+1.00 × 180" prescription with the sphere component
adjusted by the same magnitude (cross-cylinder conversion).

Two conventions are in use:

| Convention | Sign of cylinder | Sphere adjustment | Axis adjustment |
| --- | --- | --- | --- |
| **Minus-cylinder** | Always ≤ 0 | as written | as written |
| **Plus-cylinder** | Always ≥ 0 | add the original cylinder magnitude | rotate axis by 90° (mod 180) |

### Storage decision: **minus-cylinder**

This form stores cylinder in **minus-cylinder convention** because:

1. UK optometrists are trained almost exclusively in minus-cylinder.
2. The HL7 FHIR R5 `VisionPrescription` resource expects minus-cylinder.
3. The NHS GOS3 voucher uses minus-cylinder.
4. Single source of truth makes machine-readable interchange unambiguous.

### Display toggle

The SvelteKit front-end has an opt-in toggle (default off) that re-renders
the same data in plus-cylinder. This is a pure UI conversion; no plus-
cylinder value is ever persisted. Conversion formula:

```
sphere_plus = sphere_minus + cylinder_minus
cylinder_plus = -cylinder_minus
axis_plus = (axis_minus + 90) mod 180   (with 0 → 180)
```

## Axis

- Integer degrees, **1 – 180** inclusive.
- 0° is **invalid**; the convention is to write 180° for the horizontal
  meridian.
- 90° is the vertical meridian.

Axis only has meaning when cylinder magnitude is > 0. The form clears
axis to `null` when cylinder is zero, and rejects axis 0.

## Addition

- Always **positive**. Presbyopia correction adds plus power for near.
- Range +0.25 to +3.50 D in clinical practice; values outside this range
  are flagged but not rejected.
- Stored per eye; usually equal between eyes.

## Prism

- Magnitude is always **non-negative** (prism dioptres).
- Direction is encoded separately as `base_direction` ∈ {`in`, `out`,
  `up`, `down`}.
- The combined prism (e.g. "1.0 BI and 0.5 BD") is split into two rows
  on the underlying SQL: `eye_prescription_eye` allows a horizontal
  `prism_horizontal` + `base_horizontal` and a vertical `prism_vertical`
  + `base_vertical`.

## Pupillary distance

- Stored in **millimetres** (`mm`), integer or single decimal place.
- Distance PD is the total interpupillary distance for distance vision.
- Near PD is typically distance PD − 3 mm; stored explicitly to avoid
  ambiguity.
- Monocular PD is the distance from the bridge of the nose to each pupil
  independently; stored as `pupillary_distance_right_mm` and
  `pupillary_distance_left_mm`.
- Total PD = `pupillary_distance_right_mm + pupillary_distance_left_mm`.

## Quantization

All refractive numbers are quantized to **0.25 D** steps. The SQL columns
are `NUMERIC(5,2)` so the step is preserved exactly without floating-
point drift. The classification engine accepts unquantised input but the
front-end snaps to 0.25 D before submission.
