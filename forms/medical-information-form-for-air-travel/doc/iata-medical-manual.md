# IATA Medical Manual alignment

The fitness-to-fly engine is calibrated to the recovery and exclusion windows
published in the IATA *Medical Manual* (13th ed., 2023) and the Aerospace
Medical Association *Medical Guidelines for Airline Travel*. Where individual
carrier MEDIFs publish a more conservative window, the engine adopts the
**most conservative** value rather than the IATA baseline.

## Cabin physiology baseline

- Operating cabin altitude is treated as **6,000–8,000 ft** (1,829–2,438 m).
- At cabin altitude, arterial PaO2 falls to ~53–64 mmHg; a passenger with
  sea-level SpO2 ≥ 95 % normally tolerates the cabin without supplemental
  oxygen.
- Trapped gas in body cavities expands by approximately **30 %** at cabin
  altitude (Boyle's law). This drives every gas-expansion rule.

## Recovery windows used by the engine

The values below are the engine defaults. The per-airline values are listed
in [`airline-windows.md`](./airline-windows.md).

| Condition | Conservative window | Engine band | Source |
| --- | --- | --- | --- |
| Acute MI, uncomplicated | < 7 days | `unfit-to-fly` | IATA MM §11; ASMA Guidelines |
| Acute MI, complicated / failure | < 4–6 weeks | `requires-review` | IATA MM §11 |
| Coronary stent (PCI), stable | < 2 days | `requires-review` | IATA MM §11 |
| Pneumothorax, resolved | < 14 days | `unfit-to-fly` | IATA MM §12; BTS air-travel guideline |
| Intra-ocular gas tamponade | until gas reabsorbed (typically 2–6 weeks) | `unfit-to-fly` | IATA MM §13 |
| Intra-cranial gas (post-neurosurgery) | < 7 days | `unfit-to-fly` | IATA MM §12 |
| Abdominal surgery (laparotomy) | < 10–14 days | `requires-review` | IATA MM §12 |
| Stroke (CVA) | < 10 days (uncomplicated) | `requires-review` | IATA MM §11 |
| DVT / PE | once anticoagulated and stable | `requires-review` if < 6 weeks | ASMA Guidelines |
| Severe anaemia (Hb < 75 g/L) | always | `unfit-to-fly` | IATA MM §11 |
| Resting SpO2 < 85 % on room air | always | `unfit-to-fly` (or oxygen) | IATA MM §12 |
| Supplemental O2 flow > 4 L/min sustained | always | `requires-review` + DGR | IATA DGR + MM §12 |
| Singleton pregnancy > 36 weeks | always | `unfit-to-fly` | IATA MM §15; ASMA |
| Singleton pregnancy 28–36 weeks | always | `requires-review` + certificate | IATA MM §15 |
| Multiple pregnancy > 32 weeks | always | `unfit-to-fly` | IATA MM §15 |
| Active communicable disease in infectious period | always | `unfit-to-fly` | IATA MM §17 |
| Scuba diving within 24 h (no decompression) | always | `unfit-to-fly` | IATA MM §10 |

## Equipment and dangerous goods

- **Portable Oxygen Concentrators (POC):** Must appear on the carrier's
  approved-device list. Battery duration must exceed the longest sector
  duration by **+50 %** as a safety margin.
- **Supplemental oxygen, gaseous:** Subject to IATA *Dangerous Goods
  Regulations* (DGR). High-flow (> 4 L/min sustained) requires medical-desk
  authorization.
- **Lithium-ion medical batteries:** Subject to IATA DGR Packing Instruction
  967 / 970. Spare batteries must travel in cabin baggage with terminals
  protected.
- **Stretcher and incubator:** Sector-specific approval; not all aircraft
  types support stretcher loading.

## What this document is not

It is **not** a substitute for the airline medical desk's final decision.
The MEDIF engine is a *Class I documentation aid* under MDCG 2019-11 Rev.1;
the airline medical officer holds the final clearance authority.

## References

- IATA. *Medical Manual*, 13th ed., 2023.
- IATA. *Dangerous Goods Regulations* (annual ed.).
- Aerospace Medical Association. *Medical Guidelines for Airline Travel*,
  3rd ed.
- British Thoracic Society. *Air travel and lung disease: BTS recommendations
  for managing passengers with lung disease planning air travel*.
- UK Civil Aviation Authority. *Assessing fitness to fly: guidelines for
  health professionals from the Aerospace Medical Association*.
