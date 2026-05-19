# Airline recovery windows — MEDIF comparison

This table compares the MEDIF recovery and exclusion windows published by
eight reference carriers, plus the engine's "use the most conservative"
default. Values are taken from the MEDIF documents cited in
[`../seed.md`](../seed.md). Where a carrier does not publish a specific
window the cell reads "—". The engine column shows what the rules engine
applies; it is the conservative value, not an average.

## Acute medical events

| Condition | Emirates (EK) | Qatar (QR) | British Airways (BA) | LOT (LO) | KLM (KL) | Air India (AI) | ANA (NH) | Starlux (JX) | Engine |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Acute MI, uncomplicated | 7 d | 7 d | 7 d | 7 d | 7 d | 10 d | 7 d | 7 d | **< 7 d unfit** |
| Acute MI, complicated | 4–6 wk | 6 wk | 6 wk | 4 wk | 6 wk | 6 wk | 4 wk | 6 wk | **< 6 wk review** |
| Coronary stent (PCI), uncomplicated | 2 d | 2 d | 3 d | 5 d | 3 d | 5 d | 2 d | 3 d | **< 5 d review** |
| Stroke (CVA), uncomplicated | 10 d | 10 d | 10 d | 14 d | 10 d | 10 d | 10 d | 10 d | **< 14 d review** |
| Pneumothorax, resolved | 14 d | 14 d | 14 d | 7 d | 14 d | 14 d | 14 d | 14 d | **< 14 d unfit** |
| Abdominal surgery (laparotomy) | 10 d | 10 d | 10 d | 14 d | 10 d | 10 d | 10 d | 10 d | **< 14 d review** |
| Thoracic surgery | 14 d | 14 d | 14 d | 21 d | 14 d | 14 d | 14 d | 14 d | **< 21 d review** |
| Intra-ocular gas tamponade | until reabsorbed | until reabsorbed | until reabsorbed | until reabsorbed | until reabsorbed | until reabsorbed | until reabsorbed | until reabsorbed | **always unfit while gas present** |
| Intra-cranial gas | 7 d | 7 d | 7 d | 7 d | 7 d | 7 d | 7 d | 7 d | **< 7 d unfit** |
| Scuba diving (no-deco) | 12 h | 24 h | 24 h | 24 h | 24 h | 24 h | 24 h | 24 h | **< 24 h unfit** |
| Scuba diving (decompression) | 24 h | 48 h | 48 h | 48 h | 48 h | 48 h | 48 h | 48 h | **< 48 h unfit** |

## Pregnancy

| Pregnancy state | Emirates | Qatar | BA | LOT | KLM | Air India | ANA | Starlux | Engine |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Singleton, no MEDIF needed | < 28 wk | < 28 wk | < 28 wk | < 28 wk | < 28 wk | < 28 wk | < 28 wk | < 28 wk | **< 28 wk fit** |
| Singleton, certificate required | 28–36 wk | 28–36 wk | 28–36 wk | 28–36 wk | 28–36 wk | 28–36 wk | 28–36 wk | 28–36 wk | **28–36 wk review** |
| Singleton, not accepted | > 36 wk | > 36 wk | > 36 wk | > 36 wk | > 36 wk | > 36 wk | > 36 wk | > 36 wk | **> 36 wk unfit** |
| Multiple, certificate required | 24–32 wk | 28–32 wk | 28–32 wk | 28–32 wk | 28–32 wk | 28–32 wk | 28–32 wk | 28–32 wk | **24–32 wk review** |
| Multiple, not accepted | > 32 wk | > 32 wk | > 32 wk | > 32 wk | > 32 wk | > 32 wk | > 32 wk | > 32 wk | **> 32 wk unfit** |

## Oxygen and equipment

| Item | Emirates | Qatar | BA | LOT | KLM | Air India | ANA | Starlux | Engine |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Supplemental O2 flow ≤ 2 L/min | OK with MEDIF | OK with MEDIF | OK with MEDIF | OK with MEDIF | OK with MEDIF | OK with MEDIF | OK with MEDIF | OK with MEDIF | **fit-with-conditions** |
| Supplemental O2 flow 2–4 L/min | MEDIF + advance | MEDIF + advance | MEDIF + advance | MEDIF + advance | MEDIF + advance | MEDIF + advance | MEDIF + advance | MEDIF + advance | **fit-with-conditions** |
| Supplemental O2 flow > 4 L/min | senior review | senior review | senior review | senior review | senior review | senior review | senior review | senior review | **requires-review + DGR** |
| POC battery margin | sector + 50 % | sector + 50 % | sector + 50 % | sector + 50 % | sector + 50 % | sector + 50 % | sector + 50 % | sector + 50 % | **sector × 1.5** |
| Stretcher | sector-specific | sector-specific | sector-specific | sector-specific | sector-specific | sector-specific | sector-specific | sector-specific | **requires-review** |
| Incubator | sector-specific | sector-specific | sector-specific | sector-specific | sector-specific | sector-specific | sector-specific | sector-specific | **requires-review** |
| Battery-powered medical device | DGR clearance | DGR clearance | DGR clearance | DGR clearance | DGR clearance | DGR clearance | DGR clearance | DGR clearance | **requires-review + DGR** |

## Submission timing

| Carrier | MEDIF deadline | Form validity |
| --- | --- | --- |
| Emirates (EK) | ≥ 48 h before departure | 10–14 d from physician signature |
| Qatar Airways (QR) | ≥ 48 h before departure | 10 d |
| British Airways (BA) | ≥ 48 h before departure | 14 d |
| LOT Polish Airlines (LO) | ≥ 72 h before departure | 14 d |
| KLM (KL) | ≥ 72 h before departure | 14 d |
| Air India (AI) | ≥ 72 h before departure | 14 d |
| ANA (NH) | ≥ 72 h before departure | 14 d |
| Starlux (JX) | ≥ 48 h before departure | 14 d |
| **Engine default** | **≥ 72 h** (most conservative) | **10 d** (most conservative) |

## Notes on divergence

- **LOT** specifies a 7-day pneumothorax window in some translations of
  its MEDIF, shorter than IATA's 14-day baseline. The engine retains 14 days
  to remain conservative.
- **Air India** allows a 10-day window for uncomplicated MI rather than the
  IATA baseline of 7 days. The engine uses 7 days.
- **Emirates** publishes a 12-hour scuba-diving window for no-decompression
  dives versus 24 hours used by every other carrier. The engine uses 24
  hours.
- **Qatar Airways** and **British Airways** both align tightly with IATA
  baselines and produce the fewest engine overrides.

## Sources

See [`../seed.md`](../seed.md) for primary carrier MEDIF document URLs.
