# United Kingdom death registration — Reference documentation

Source material for the registration rules this form encodes. Retrieved 2026-11-20.
Nothing here is legal advice; the registrar's checks remain definitive.

## GOV.UK sources

| Source | Establishes |
| --- | --- |
| [Register a death](https://www.gov.uk/register-a-death) | Where to register (deaths in the UK or abroad); a death on a ship or aircraft registers in the country where the vessel is registered; a death abroad can only be registered if it happened on or after 1 January 1983 |
| [Register the death](https://www.gov.uk/after-a-death/register-the-death) | Register within **5 days** (8 days in Scotland) of the medical examiner's confirmation; weekends and bank holidays count; tell the register office immediately if more time is needed; wait for the medical examiner's office to confirm; the registrar issues the certificate for burial or cremation, "the green form", for the funeral director, crematorium or burial authority; Tell Us Once informs government departments |
| [When a death is reported to a coroner](https://www.gov.uk/after-a-death/when-a-death-is-reported-to-a-coroner) | Coroner may investigate, order a post-mortem, or open an inquest (cause unknown, violent or unnatural, or death in prison or police custody). With no inquest the coroner sends form CN2 to the registrar; for a cremation also the Cremation 6 certificate. After an inquest the registrar registers on the coroner's certificate. An interim death certificate can be requested while waiting; either certificate works for probate and Tell Us Once |
| [Arrange the funeral](https://www.gov.uk/after-a-death/arrange-the-funeral) | The funeral can usually only take place after the death is registered, unless reported to a coroner |
| [Order a copy of a certificate](https://www.gov.uk/order-copy-birth-death-marriage-certificate) | GRO online GBP 12.50 per certificate (extra copies the same), sent in about 4 days; without a GRO index reference add GBP 3.50 per search and about 15 working days; priority service GBP 38.50 dispatched next working day if ordered by 4pm; also by phone (0300 123 1837) or post, or from the local register office |
| [Tell Us Once](https://www.gov.uk/tell-us-once) | Reporting a death to government departments in one go, using the reference number from the registrar |

## Statutory sources

- Births and Deaths Registration Act 1953: registration of deaths; section 16 lists
  the qualified informants (a relative present at the death or in attendance during the
  last illness, a relative residing in the sub-district, a person present at the death,
  the occupier of the premises, the person causing the body to be disposed of). The
  engine's six categories summarize these as GOV.UK and register offices apply them.
- Coroners and Justice Act 2009 and Coroners (Investigations) Regulations 2013:
  coroner involvement and the coroner's certificates.
- Medical Certificate of Cause of Death Regulations 2024: the statutory medical
  examiner system whose confirmation starts the 5-day clock.

## Modelling decisions

- **Clock.** Calendar days from `medicalExaminerConfirmationDate`; more than 5 is
  overdue, 4 or 5 is due soon. GOV.UK's "within 5 days" is read as day 5 still being
  in time.
- **Coroner.** A pending referral outranks every other issue and pauses the clock; a
  coroner certificate in hand replaces the MCCD and medical examiner rules.
- **Scotland and Northern Ireland.** Different deadlines (8 days in Scotland) and
  processes; out of scope, flagged as a blocking rule.
- **Fees.** Quoted for context in flag text; they change, so the engine never
  computes money.
- **Distinct from the MCCD form.** The certificate's clinical content (cause-of-death
  lines, certifier details) lives in
  [`medical-certificate-of-cause-of-death`](../../medical-certificate-of-cause-of-death/index.md).

See the form root [`../index.md`](../index.md) for the full design description.
