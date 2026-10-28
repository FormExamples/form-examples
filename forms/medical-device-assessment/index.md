# Medical Device Assessment

A single-page, step-by-step questionnaire that assesses a medical device
against the EU MDR 2017/745 Annex VIII classification rules (mirrored by the
UK Medical Devices Regulations 2002). The assessor describes the device; the
engine computes the risk class (I, IIa, IIb, III), the conformity-assessment
route, and flags regulatory-readiness gaps.

This is a decision aid for regulatory-affairs and quality teams. It is not a
substitute for a notified body's or the MHRA's determination.

## Wizard steps

| Step | Title                    | Collects                                                                |
| ---- | ------------------------ | ----------------------------------------------------------------------- |
| 1    | Manufacturer and assessor | Manufacturer, authorized representative, UK responsible person, assessor |
| 2    | Device identification    | Name, model, UDI, intended purpose, intended user, jurisdiction         |
| 3    | Device kind and contact  | Invasive / implantable / active / software, duration, body site         |
| 4    | Active devices           | Therapeutic, diagnostic, energy, medicinal substances, closed loop      |
| 5    | Software                 | Software purpose and worst-case harm (Rule 11)                          |
| 6    | Special characteristics  | Medicinal substance, tissue, nanomaterial, absorbed substances          |
| 7    | Suffix modifiers         | Sterile (s), measuring function (m), reusable surgical instrument (r)   |
| 8    | Regulatory readiness     | Clinical evidence, ISO 14971, ISO 13485, cybersecurity, PMS, UDI        |
| 9    | Report                   | Class, conformity route, fired rules, flags, assessor sign-off          |

## Scoring system

The engine applies the Annex VIII rules that the inputs can decide and takes
the **highest** class any rule yields (Annex VIII §3.5). Suffixes `s`, `m`,
`r` are added to Class I devices and select a partial notified-body route.

| Rule | Subject                                   | Result                                                         |
| ---- | ----------------------------------------- | -------------------------------------------------------------- |
| 1    | Non-invasive, no other rule applies       | I                                                              |
| 2    | Channels / stores body substances         | IIa if connected to Class IIa+ active device; otherwise I      |
| 5    | Invasive via body orifice                 | transient I; short-term IIa (I in oral/nasal/ear); long-term IIb (IIa in oral/nasal/ear) |
| 6    | Surgically invasive, transient            | IIa (I if reusable surgical instrument)                        |
| 7    | Surgically invasive, short-term           | IIa                                                            |
| 8    | Implantable and long-term surgical        | IIb; III in heart, central circulatory system or CNS           |
| 9    | Active therapeutic, energy                | IIa; IIb if potentially hazardous                              |
| 10   | Active diagnostic and monitoring          | IIa; IIb if monitoring vital parameters                        |
| 11   | Software                                  | IIa; IIb for serious harm; III for death/irreversible harm; I if no clinical purpose |
| 12   | Active, administers/removes substances    | IIa; IIb if potentially hazardous                              |
| 13   | All other active devices                  | I                                                              |
| 14   | Contains medicinal substance              | III                                                            |
| 15   | Contraception / STI prevention            | IIb; III if implantable or long-term invasive                  |
| 16   | Disinfects or cleans devices              | IIa                                                            |
| 18   | Human or animal tissue                    | III                                                            |
| 19   | Nanomaterial, high exposure potential     | III                                                            |
| 21   | Composed of absorbed substances           | IIa (III if absorbed systemically for the action)              |
| 22   | Active closed-loop therapy                | III                                                            |

Conformity route: Class I self-declaration; Is / Im / Ir partial notified-body
involvement; IIa, IIb, III full notified-body assessment.

## Flags

Flags fire independently of the class: missing intended purpose, clinical
evidence gap, no ISO 14971 risk-management file, no ISO 13485 QMS, no
cybersecurity assessment for software or active devices, no post-market
surveillance plan, no UDI, notified body required, software as a medical
device, medicinal-substance combination, tissue origin, nanomaterial, and
in-vitro-diagnostic out of scope (IVDR 2017/746 applies instead).

## Compliance

Classification of this software itself: see [`AGENTS.md`](AGENTS.md) and the
repo baseline in [`/AGENTS.md`](../../AGENTS.md).

- [EU MDR 2017/745 Annex VIII](https://eur-lex.europa.eu/eli/reg/2017/745/oj)
- [MDCG 2021-24 — Guidance on classification of medical devices](https://health.ec.europa.eu/document/download/cbb8f6e2-f8ec-4e43-9f4c-3a0c8e1e0b9d_en)
- [UK Medical Devices Regulations 2002](https://www.legislation.gov.uk/uksi/2002/618/contents)
- ISO 14971 (risk management), ISO 13485 (quality management)

Rules 3, 4 and 17 are not modelled. The engine is `front-end-with-html/js/device-grader.js`.
