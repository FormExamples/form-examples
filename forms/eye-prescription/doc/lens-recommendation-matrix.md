# Lens Recommendation Matrix

Decision table used by step 9 of the wizard to recommend lens material,
coating, and design. The matrix is **advisory**: the dispensing optician
may override based on frame choice, budget, and patient preference.

## Material selection

| Sphere magnitude | Cylinder magnitude | Recommended material | Refractive index | Notes |
| --- | --- | --- | --- | --- |
| ≤ 2.00 D | ≤ 1.00 D | CR-39 | 1.498 | Default; lowest cost. |
| 2.25 – 4.00 D | ≤ 2.00 D | Trivex | 1.532 | Impact-resistant; light. |
| 4.25 – 6.00 D | any | Polycarbonate or mid-index | 1.59–1.60 | Impact-resistant. |
| > 6.00 D | any | High-index 1.67 | 1.670 | Thinner; some chromatic aberration. |
| > 8.00 D | any | High-index 1.74 | 1.740 | Thinnest; AR coating required. |
| any (paediatric) | any | Polycarbonate or Trivex | 1.586 / 1.532 | Impact-resistant; required by some practices for children. |
| any (occupational hazard) | any | Polycarbonate or Trivex | 1.586 / 1.532 | Impact-resistant. |

## Lens design selection

| Prescription pattern | Recommended design |
| --- | --- |
| Single distance correction only | Single vision distance |
| Single near correction only | Single vision near |
| Distance + near (addition ≥ +0.75) | Bifocal or varifocal (patient preference) |
| Distance + intermediate + near (computer user) | Occupational varifocal |
| High astigmatism (cyl > 2.5) | Aspheric or atoric lens |
| High myopia (sphere < -6.00) | Aspheric, edge-coated |
| High hyperopia (sphere > +5.00) | Aspheric, anti-magnification coating |

## Coating recommendations

| Coating | When to recommend |
| --- | --- |
| Anti-reflective (AR) | Always when high-index material is used; recommended for all night drivers. |
| Scratch-resistant | Always for paediatric and active lifestyle. |
| Hydrophobic | When patient reports lens fogging or smudging issues. |
| Blue-light filter | On patient request; not mandated by evidence. |
| Photochromic | Patient who spends significant time outdoors. |
| Polarized | Driver, water-sports, fishing. |
| UV-400 | Always — patient education on UV protection. |

## Tint recommendations

| Tint | When to recommend |
| --- | --- |
| Clear | Default. |
| Light tint (10–25 %) | Cosmetic; mild photophobia. |
| Medium tint (25–50 %) | Outdoor use, mild glare. |
| Sunglass tint (75–85 %) | Sunglass use; second pair recommended over photochromic for in-car use (some windscreens block UV). |

## Frame recommendations (informational)

| Prescription | Frame considerations |
| --- | --- |
| High sphere magnitude (> 6 D) | Smaller eye-size frames reduce edge thickness. |
| Significant cylinder | Symmetric round / oval frames avoid axis-rotation issues. |
| Bifocal | Frame must accommodate segment height (typically ≥ 22 mm B-measurement). |
| Varifocal | Frame must accommodate corridor length (typically ≥ 22 mm B-measurement; short-corridor designs require ≥ 18 mm). |
| Paediatric | Flexible hinge frames; nose-pad adjustable. |

## Output structure

The lens recommendation is stored as a single row in
`eye_prescription_lens_recommendation` referencing the parent
`eye_prescription`. Fields include `lens_type`, `material`,
`refractive_index`, `coating_anti_reflective`, `coating_scratch_resistant`,
`coating_blue_light`, `coating_photochromic`, `coating_polarised`,
`tint_description`, `tint_percent`, `uv_protection`, and a free-text
`dispenser_notes`.
