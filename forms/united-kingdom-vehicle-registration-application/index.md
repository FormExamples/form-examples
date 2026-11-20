# United Kingdom Vehicle Registration Application

Registering a vehicle with the Driver and Vehicle Licensing Agency (DVLA) in Great
Britain: the **V62** application for a vehicle registration certificate (V5C, the
log book), and the first-registration variants **V55/4** (new vehicle),
**V55/5** (used vehicle), imported vehicles, and **V627/1** (rebuilt or kit
vehicles). The applicant records who is applying, who the registered keeper and
owner are, the vehicle's identity, the evidence enclosed, and the fee, and the
form checks the application before it is posted.

The form is not a clinical score. Its engine is a **completeness and validity**
engine: it checks that the keeper, vehicle, VIN, and registration number are
present and well-formed; that the identity documents, vehicle approval, MOT,
insurance, HMRC arrival notice (NOVA), and build evidence the DVLA asks for are
enclosed; and that the fee matches the form. It classifies the application as
**Ready to submit**, **Incomplete**, or **Needs supporting documents**, works out
the fee due, and raises flagged issues. It makes no decision on the application:
only the DVLA decides whether a vehicle is registered, and the DVLA may inspect
the vehicle.

Three DVLA medical forms already exist in this repository
([B1](../united-kingdom-driver-and-vehicle-licensing-agency-b1-form/),
[M1](../united-kingdom-driver-and-vehicle-licensing-agency-m1-form/),
[V1](../united-kingdom-driver-and-vehicle-licensing-agency-v1-form/)); they
declare a driver's medical conditions. This form is about the vehicle.

## Scope and intended users

- **Setting:** a keeper, a dealer, or a helper preparing a postal application to
  the DVLA for a vehicle in Great Britain.
- **Applications:** V62 replacement V5C (lost, stolen, destroyed, damaged, or not
  received); V62 for a vehicle acquired without a V5C; V55/4 new vehicle; V55/5
  used vehicle; imported vehicle; V627/1 rebuilt or kit vehicle.
- **Out of scope:** submitting to the DVLA, payment, vehicle look-ups, Northern
  Ireland registration (run by the DVA), commercial secure-registration schemes.

## Applications and fees

| Application | DVLA form | Fee | Extra evidence |
| --- | --- | --- | --- |
| V62 replacement V5C | V62 | £25 (nothing when a V5C not received is chased within 6 weeks) | none |
| V62, vehicle acquired without a V5C | V62 | nothing with the new-keeper slip, else £25 | identity |
| New vehicle | V55/4 | £55 | identity, certificate of newness, vehicle approval |
| Used vehicle | V55/5 | £55 | identity, approval if under 10 years old, MOT if over 3 years old |
| Imported vehicle | V55/4 or V55/5 | £55 | as above, plus HMRC NOVA within 14 days |
| Rebuilt or kit vehicle | V627/1 | £55 | as above, plus build evidence |

Payment is by cheque or postal order payable to DVLA, Swansea. Never send cash.

## Validity model

1. **Incomplete** — a required detail is missing, the VIN or registration number
   is malformed, the vehicle is seriously damaged (it cannot be registered), or
   the declaration is unsigned.
2. **Needs supporting documents** — every detail is present but an identity
   document, vehicle approval, MOT, insurance (Northern Ireland address), NOVA
   reference, build evidence, or the correct fee is missing.
3. **Ready to submit** — nothing is missing. This is a completeness check and not
   an approval.

`incomplete` outranks `needs-supporting-documents`, so the applicant finishes the
form before gathering evidence. See [`spec/index.md`](./spec/index.md) §4 for the
algorithm, §5 for the flags, and [`doc/index.md`](./doc/index.md) for the
research and the assumptions.

## Assessment steps

Completed in order on a single continuous single-page wizard.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Application | application type, date, V5C status, new-keeper slip |
| 2 | Applicant | name, date of birth, address, licence number, identity and address documents |
| 3 | Keeper and owner | keeper name and type, company number, owner differs, Northern Ireland address |
| 4 | Vehicle | registration number, VIN, engine number, make, model, dates, serious damage |
| 5 | Supporting evidence | certificate of newness, type approval, MOT, insurance, build evidence |
| 6 | Imported vehicle | country of export, arrival date, NOVA status and reference |
| 7 | Fee and declaration | payment method and amount, signed declaration |
| 8 | Summary and validity | live validity class, fee due, missing count |

## Conventions

- Empty string `''` for unanswered text and enum fields; `null` for unanswered
  numeric, date, and time fields.
- camelCase property names in TypeScript and front-end Rust serde; snake_case in
  SQL and Rust internals.
- UUIDv4 primary keys via `gen_random_uuid()`.
- Timestamps on every table: `created_at`, `updated_at`, `deleted_at`.
- Import and export via JSON, XML, CSV, and TSV.
- The validation engine is pure (no side effects, no I/O, no wall clock) and
  unit-tested.

## Compliance

- **ISO/IEC/IEEE 26514:2022** — design and development of information for users.
- Not a medical device: there is no medical purpose, so MDCG 2019-11 and the UK
  Medical Devices Regulations 2002 are not engaged.
- Governed by the Vehicle Excise and Registration Act 1994 and the Road Vehicles
  (Registration and Licensing) Regulations 2002. The tool is a completeness aid
  only; the DVLA decides every application, and rules and fees change.

## References

- [GOV.UK — Register a vehicle: new registrations](https://www.gov.uk/vehicle-registration/new-registrations)
- [GOV.UK — New and used vehicles](https://www.gov.uk/vehicle-registration/new-and-used-vehicles)
- [GOV.UK — Get a vehicle log book (V5C) if you cannot apply online](https://www.gov.uk/vehicle-log-book/if-you-cannot-apply-online)
- [GOV.UK — Importing vehicles into the UK](https://www.gov.uk/importing-vehicles-into-the-uk)
- [GOV.UK — Application for a vehicle registration certificate (V62)](https://www.gov.uk/government/publications/application-for-a-vehicle-registration-certificate)

## Verify

```sh
bin/test-form united-kingdom-vehicle-registration-application
```
