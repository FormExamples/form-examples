# European Hernia Society (EHS) groin-hernia classification

Source: Miserez M, Peeters E, Aufenacker T, et al. *Update with level 1
evidence on the European Hernia Society (EHS) groin hernia management
guideline.* Hernia 2007;18(2):151–63; Simons MP, et al. *European Hernia
Society guidelines on the treatment of inguinal hernia in adult patients.*
Hernia 2009;13(4):343–403.

This form applies the EHS classification framework to every hernia type
recorded on step 9, not only groin hernias, using the same type / subtype /
laterality / size-grade structure the EHS guideline established for inguinal
and femoral hernias.

## Hernia type

Recorded on step 9 (`classification.herniaType`): inguinal, femoral,
umbilical, epigastric, incisional, paraumbilical, spigelian, or other. Only
inguinal and femoral hernias are within the EHS guideline's original scope;
the other types are recorded using the same wizard step for a single
consistent data model, with the EHS-specific subtype and size grade applying
by convention rather than by published EHS scope.

## Inguinal subtype

Applies only when `herniaType === 'inguinal'` (`classification.inguinalSubtype`):

| Subtype | Description |
| --- | --- |
| `direct` | Protrudes through Hesselbach's triangle, medial to the inferior epigastric vessels; acquired, associated with a weakened transversalis fascia. |
| `indirect` | Passes through the deep inguinal ring, lateral to the inferior epigastric vessels; may be congenital (patent processus vaginalis) or acquired. |
| `pantaloon` | Combined direct and indirect components straddling the inferior epigastric vessels. |
| `uncertain` | Subtype not determined on examination; imaging or operative findings may clarify. |

For every other hernia type, `herniaSubtype` is reported as `not-applicable`.

## Laterality

`classification.laterality`: left, right, or bilateral.

## EHS size grade

Recorded on step 9 (`classification.ehsSizeGrade`), measured on palpation
(step 6, `palpation.massSizeAsCm`) and banded:

| Grade | Size | Rule ID |
| --- | --- | --- |
| `1` | less than 2 cm | `R-CLASSIFICATION-TYPE` (banding is clinician-entered, not auto-computed from `massSizeAsCm`, because palpated size varies with reduction state) |
| `2` | 2 to 4 cm | as above |
| `3` | more than 4 cm | `R-CLASSIFICATION-EHS-GRADE-3` — contributes to the `soon` urgency band even in an otherwise reassuring, reducible presentation |

The engine deliberately does not auto-derive the size grade from
`massSizeAsCm`, because the measured size of a reducible hernia depends on
whether it was measured reduced or protruding; the clinician bands it directly
on step 9 having taken that into account.

## Human-readable classification string

`grader.ts`'s `classifyHernia()` builds a single `ehsClassification` string —
for example `"Inguinal, Indirect, Right, EHS grade 2 (2-4cm)"` — for display on
the step-14 summary, the PDF report, and the referral letter. It is built from
type, subtype (when inguinal), laterality, and size grade, omitting any part
that has not yet been answered.
