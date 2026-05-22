# OPG Registration Workflow

The Office of the Public Guardian (OPG) is the agency that puts an LPA
on the legal register. Until registration is complete the LPA has **no
legal effect** — an attorney cannot use it to operate a bank account,
sell property, or claim benefits.

This document covers the registration process at the level of detail
shown in LP1F sections 12–15 and the LP12 Guide parts C–D.

## Who can apply

LPA Regs 2007 reg. 11 + LP1F section 12.

- **The donor**, while still capacitous. Donor-led registration is
  recommended because the donor can resolve OPG queries directly.
- **One or more of the attorneys**, in which case:
  - If the attorneys are appointed *jointly and severally* — any one
    attorney may apply.
  - If the attorneys are appointed *jointly* — all attorneys must
    apply together and all must sign section 15.
  - If the attorneys are appointed *jointly for some decisions,
    severally for others* — all attorneys must apply together for the
    joint decisions.

No other person may apply. A person who is neither donor nor attorney
who attempts to apply will be rejected — the validation engine fires
`RegistrationApplicantInvalid`.

## What is sent to OPG

| Item | Required | Note |
| --- | --- | --- |
| Completed LP1F (all 15 sections) | yes | Original wet-signed pages, in the correct signing order |
| LPC continuation sheets | conditional | LPC1 if > 4 attorneys; LPC2 if mixed-decision; LPC3 if signed on behalf of donor; LPC4 if trust corporation |
| LP3 evidence of notification | conditional | One LP3 per person-to-notify; sent **before** the LP1F is sent to OPG |
| LPA120A reduced-fee form + evidence | conditional | If reduced or waived fee requested |
| Application fee | conditional | £82 unless waived; payable by card (over the phone after submission) or by cheque payable to "Office of the Public Guardian" |

Postal address:

> Office of the Public Guardian
> PO Box 16185
> Birmingham
> B2 2WH

(Confirmed on LP1F October 2025 and LP12 Guide August 2025.)

## The four-week waiting period

MCA 2005 Sch. 1 para. 6 + LPA Regs 2007 reg. 14.

1. **LP3 notice** — before sending LP1F to OPG, the applicant must
   give each person named in section 6 a completed LP3 form. The LP3
   tells them an application is going to be made and explains how to
   object.
2. **OPG application** — the applicant then sends LP1F (and any LPC
   sheets, plus the fee) to OPG.
3. **Waiting period** — OPG opens the file, runs initial checks, and
   waits **four weeks** from the date notice was given to allow time
   for objections to be lodged.
4. **Register** — if no objection is received, or every objection
   is dismissed, the OPG enters the LPA on the register, stamps every
   page, and returns the original deed to the applicant.

## Fees

The current fee for registering one LPA is **£82** (as of the LP1F
October 2025 issue). The fee is set by the Public Guardian (Fees,
etc.) Regulations 2007 (SI 2007/2051) as amended.

Two LPAs (e.g. property-and-financial plus health-and-welfare) cost
£82 × 2 = £164.

### Reduced or waived fee — LPA120A

The donor may apply on form LPA120A for:

| Status | Outcome |
| --- | --- |
| Net annual income < £12,000 | 50% reduced fee (£41) |
| In receipt of a qualifying means-tested benefit (e.g. Income Support, income-based JSA, income-related ESA, Guarantee Credit element of Pension Credit, Universal Credit with conditions, Housing Benefit, Council Tax Reduction, Working Tax Credit with conditions, Local Housing Allowance) | Fee exemption (£0) |

LPA120A must be sent **with** LP1F together with documentary evidence
(bank statement, benefit award letter, payslip, etc.). Without LPA120A
and evidence the OPG cannot waive — the validator fires the
`ReducedFeeWithoutLPA120A` flag.

### Repeat application

If the OPG has previously rejected this LPA and the applicant is
re-submitting after corrections, LP1F section 14 lets the applicant
quote the original case number; the resubmission fee is currently
half (£41) under reg. 7.

## Processing time

The OPG's published service standard at the time of writing is
**20 weeks** from receipt of a correctly completed application. The
applicant cannot use the LPA until they receive the registered original
back from OPG with every page stamped.

About **1 in 5** applications are returned for correction (LP12 Guide
part D). The validation engine is intended to drive that rate towards
zero before the deed is signed.

## Objections

LPA Regs 2007 regs. 15–19.

Two routes:

### 1. Objection by a person to notify (factual grounds, OPG handles)

Reg. 15(1). Within three weeks of receiving the LP3, a person named
under section 6 may object on **factual** grounds:

- The donor is dead.
- The donor and attorney were married and have since divorced (or
  civil partnership ended), and the LPA does not say it survives.
- An attorney is bankrupt or subject to a debt relief order.
- An attorney is a trust corporation that has been wound up.
- An attorney lacks capacity.
- An attorney has disclaimed their appointment.

Objection is made on form **LPA007**.

### 2. Objection on prescribed grounds (Court of Protection)

Reg. 15(3). Within three weeks of receiving the LP3, a person named
under section 6 may object on **prescribed** grounds:

- The LPA is not a valid LPA (e.g. donor lacked capacity, fraud, undue
  pressure, prescribed form requirements not met).
- The power has been revoked.
- The donor was incapacitated when the LPA was made.

Prescribed-ground objection is made on form **LPA008** to the Court of
Protection, which adjudicates and may direct the OPG to refuse
registration.

The donor may also apply to revoke their own LPA at any time while
they have capacity (MCA 2005 s. 13(2)).

## Rejection and correction

If the OPG identifies an error (incorrect signing order, mis-dated
witness, missing continuation sheet, ineligible certificate provider,
etc.), it writes to the applicant with a list of corrections and a
deadline.

Routes:

- **Minor correction** — the applicant amends and re-sends. No new
  fee.
- **Major correction** — the LPA must be re-executed (fresh witness
  signatures, fresh dates) and a fresh application made. The
  resubmission fee (50% of the standard fee) applies under reg. 7.
- **Fundamental defect** — the LPA cannot be saved (e.g. donor lacks
  capacity when it was signed). A new LPA must be drafted from
  scratch.

## Appeal

A decision by the OPG to refuse registration may be challenged in the
Court of Protection (MCA 2005 s. 23). The court can direct the OPG to
register, refuse, or vary the LPA, and may also revoke a registered
LPA if the attorney has behaved improperly (s. 22(4)(b)).

## After registration

- The LPA is recorded on the **register of LPAs** maintained by the
  Public Guardian under MCA 2005 s. 58(1)(a). The register is
  accessible by interested parties under reg. 28.
- The original deed is returned to the applicant with every page
  marked with the OPG perforated stamp.
- A separate "use a lasting power of attorney" service is operated by
  GOV.UK at <https://www.gov.uk/use-lasting-power-of-attorney> where
  the donor / attorney can generate an access code so that banks and
  other organisations can verify the LPA online.
- The OPG retains its case file for **20 years from the death of the
  donor**.

## Useful contacts

| Purpose | Contact |
| --- | --- |
| OPG general enquiries | 0300 456 0300 |
| OPG email | customerservices@publicguardian.gov.uk |
| OPG Welsh-language line | 0300 456 0300 (request Welsh) |
| Court of Protection | 0300 456 4600 |
| Online registration / use service | <https://www.gov.uk/use-lasting-power-of-attorney> |
