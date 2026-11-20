# United Kingdom Vehicle Registration Application — Reference documentation

Research notes for the form: what GOV.UK and the DVLA publish, which rules the
engine encodes, and which are assumptions to re-check. Researched 2026-11-20; the
DVLA changes forms and fees, so check GOV.UK before relying on a rule.

See the form root [`../index.md`](../index.md) for the design and
[`../spec/index.md`](../spec/index.md) for the contract.

## Sources read

| Source | What it gave the engine |
| --- | --- |
| [Register a vehicle: new registrations](https://www.gov.uk/vehicle-registration/new-registrations) | V55/4 (new, including new imports and newly built kit cars) and V55/5 (used, including used imports and vehicles brought back after export); £55 new registration fee; identity: a photocopy of a photocard licence, or one document proving name and one proving address; proof of approval if under 10 years old unless exempt; certificate of newness (declaration for imports) if new; MOT if over 3 years old (4 in Northern Ireland); insurance certificate or cover note for a Northern Ireland address; a vehicle that cannot be repaired cannot be registered, and fees are not refunded; DVLA may inspect; V5C usually within 4 weeks |
| [New and used vehicles](https://www.gov.uk/vehicle-registration/new-and-used-vehicles) | No V5C: send V62 with the fee; V62 with the new-keeper slip; £25 for a V5C not chased within 6 weeks; MOT after 3 years; insurance before use |
| [Get a vehicle log book (V5C) if you cannot apply online](https://www.gov.uk/vehicle-log-book/if-you-cannot-apply-online) | V62 by post: £25 by cheque or postal order to "DVLA, Swansea"; the green new-keeper slip; post to DVLA, Swansea, SA99 1DD; no ID requirement is listed on this page |
| [Importing vehicles into the UK](https://www.gov.uk/importing-vehicles-into-the-uk) | Import declaration, VAT and duty, **tell HMRC within 14 days**, NOVA (Notification of Vehicle Arrivals), vehicle approval, then registration and tax, then insurance |
| [Old vehicles](https://www.gov.uk/vehicle-registration/old-vehicles) | A vehicle not taxed since 1983 follows the new-registration route; V765 for an original number |
| V62 form PDF and the V355/5 guide | The form is print-only and posted; no cash |

## Rules the engine encodes

| Rule | Basis |
| --- | --- |
| Fee 2500p for a V62; 5500p for a first registration | GOV.UK pages above |
| V62 free with a new-keeper slip | GOV.UK: send the slip; without it £25 |
| V5C not received: no fee if the DVLA is contacted within 6 weeks, else £25 | GOV.UK new-and-used page |
| Identity evidence for a first registration | GOV.UK new-registrations page |
| Type approval under 10 years old | GOV.UK new-registrations page |
| MOT over 3 years old (over 4 in Northern Ireland) | GOV.UK new-registrations page |
| Insurance evidence for a Northern Ireland address | GOV.UK new-registrations page |
| NOVA for an import, with a reference | GOV.UK importing page |
| Cannot register a seriously damaged vehicle | GOV.UK new-registrations page |
| Cheque or postal order, never cash | GOV.UK V62 page and the V62 form |

## Assumptions to re-check (not confirmed by the pages read)

- **Identity for a V62.** GOV.UK lists no ID requirement for a V62 by post. The
  engine asks for identity only for a first registration and for a V62 for a
  vehicle acquired without a V5C (an assumption that the DVLA will want to see
  who is claiming the vehicle). A V62 replacement for a keeper already on record
  does not require it.
- **Engine number and VIN for a first registration.** Treated as required; the
  V55 forms ask for them, but the pages read do not list them.
- **Registration number.** Required for a V62 and optional for a first
  registration, where the DVLA assigns one.
- **Entitlement for a V62 without a new-keeper slip.** The engine raises a medium
  flag and charges £25; it does not demand a specific proof-of-purchase document
  because the pages read do not name one.
- **V627/1 build evidence.** GOV.UK says kit-built vehicles need "vehicle
  documents, such as build plans"; the V627/1 form itself was not read, so the
  engine asks for "receipts and build evidence" generally.
- **Fee for V627/1.** Treated as the £55 first-registration fee.
- **Registration-number and VIN formats.** Format sanity only (the five GB
  registration patterns; the ISO 3779 17-character VIN with no I, O, or Q for
  vehicles made from 1981). It does not look anything up.
- **Northern Ireland.** Registration in Northern Ireland is run by the DVA; the
  form only models the DVLA rules that differ for a Northern Ireland address
  (insurance certificate, a 4-year MOT threshold).

## Design notes

- The engine is deterministic: every age comparison uses `applicationDate`, never
  the wall clock, so personas cannot rot.
- `incomplete` outranks `needs-supporting-documents` so the applicant finishes
  the form before collecting evidence.
- The flags are independent of the class; for example a fully complete V62 still
  carries a low "V5C lost" flag that explains the fee.
