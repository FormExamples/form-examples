# Patient Room Readiness — Spec

Living spec for `patient-room-readiness`. This is the canonical,
hand-maintained source of the 25 checkpoints. Front-end field names
(`front-end-with-svelte/src/lib/engine/types.ts`,
`front-end-with-html/js/types.js`) and the SQL column names must stay
in sync with this list.

## Location

- Building Name/Number
- Room Name/Number

## Checklist (25 checkpoints)

Each checkpoint is a simple checked (ready) / unchecked (not ready)
confirmation.

| # | Item | Field name |
| --- | --- | --- |
| 1 | Patient Cot/Mattress/side railings | `patientCotMattressSideRailings` |
| 2 | Attendant Cot / Mattress | `attendantCotMattress` |
| 3 | Call Bell | `callBell` |
| 4 | Cardiac Table / IV Stand | `cardiacTableIvStand` |
| 5 | Hot Kettle / Glasses | `hotKettleGlasses` |
| 6 | Linen / Patient Dress | `linenPatientDress` |
| 7 | Landline / Numbers | `landlineNumbers` |
| 8 | Refrigerator / Fan | `refrigeratorFan` |
| 9 | Television / Remote | `televisionRemote` |
| 10 | Dustbin | `dustbin` |
| 11 | Bath Towel / Handtowels | `bathTowelHandtowels` |
| 12 | Wc / Dust bins | `wcDustbins` |
| 13 | Washbasin & Fittings | `washbasinAndFittings` |
| 14 | Bucket & Mug | `bucketAndMug` |
| 15 | Geyser | `geyser` |
| 16 | Soap Dispenser | `soapDispenser` |
| 17 | Toilet Kit | `toiletKit` |
| 18 | Window Glass/Groves | `windowGlassGrooves` |
| 19 | Sidewalls | `sidewalls` |
| 20 | Curtain/Blind | `curtainBlind` |
| 21 | Chair/Sofa | `chairSofa` |
| 22 | Wall Seepage / Water Leakage | `wallSeepageWaterLeakage` |
| 23 | Electricity Points / Lights | `electricityPointsLights` |
| 24 | Ceiling/Tiles | `ceilingTiles` |
| 25 | Door / Knobs / Stopper | `doorKnobsStopper` |

## Inspector

- Name
- Email

## Inspection

- Date
- Time

## Source

Transcribed verbatim from a hospital housekeeping / facilities
room-readiness proforma.
