# United Kingdom Council Tax Discount Application — reference documentation

Research notes behind the eligibility rules. Eligibility is decided by the
billing authority; these notes are a summary of public guidance, last read
2026-11-20, and are not legal advice.

## GOV.UK guidance (England)

- [Council Tax: who has to pay](https://www.gov.uk/council-tax/who-has-to-pay)
  — 25% off if you pay Council Tax and live alone, or everyone else in the home
  is disregarded; 50% off if everyone in the household is disregarded; you must
  apply even if you are disregarded. Disregarded people: under 18; certain
  apprentices; 18 or 19 in full-time education; full-time students; under 25
  funded by the Education and Skills Funding Agency; student nurses; British
  Council foreign language assistants; severely mentally impaired people;
  live-in carers (for someone who is not their partner, spouse or child under
  18); diplomats. Apprentice declaration from the employer: paid no more than
  £195 a week and training leading to an Ofqual-accredited qualification. If a
  discount is received in error the council must be told, or a fine may follow,
  and the discount may have to be repaid.
- [Council Tax: discounts for full-time students](https://www.gov.uk/council-tax/discounts-for-full-time-students)
  — full-time means a course of at least 1 year and at least 21 hours of study a
  week (under-20s studying up to A level: at least 3 months and 12 hours a
  week). A household where everyone is a full-time student is exempt; if
  someone is not a student the household gets a bill but may get a discount.
- [Council Tax: disabled band reduction scheme](https://www.gov.uk/council-tax/discounts-for-disabled-people)
  — the bill is reduced to the next lowest band (Band A properties get 17% off)
  when the home is larger than needed because of a disabled occupant: an extra
  bathroom, kitchen or other room, or extra indoor space for a wheelchair. The
  property must be the main home of at least one disabled person, adult or
  child.
- [Apply for a Council Tax discount](https://www.gov.uk/apply-for-council-tax-discount)
  — England and Wales service that sends the applicant to their local council by
  postcode.
- [Council Tax Reduction](https://www.gov.uk/council-tax-reduction) — also called
  Council Tax Support; a reduction of up to 100% for people on a low income or
  claiming benefits; each council runs its own scheme, and the award depends on
  income, savings, partner, children and other adults.

## Statute and regulations (from the public record; verify with the authority)

- Local Government Finance Act 1992, section 11 and Schedule 1 (discounts and
  disregarded persons, including severe mental impairment) and section 4 and the
  Council Tax (Exempt Dwellings) Order 1992 (exemptions, including all-student
  dwellings). Severe mental impairment needs a certificate from a registered
  medical practitioner and entitlement to a qualifying benefit.
- Council Tax (Reductions for Disabilities) Regulations 1992 (the disabled band
  reduction).
- Council Tax (Administration and Enforcement) Regulations 1992, regulation 29:
  a liable person must notify the authority within 21 days of a change that
  affects a discount, exemption or disregard; a civil penalty can follow
  (Local Government Finance Act 1992, Schedule 3).
- Backdating of a discount is at the authority's discretion and depends on the
  applicant showing the circumstances applied throughout the period.
- Knowingly giving false information can lead to a penalty and to prosecution
  (for example under the Fraud Act 2006).
- Care leavers: relief for care leavers under 25 is provided through the
  authority's own policy or statutory exemption in some areas; the engine asks
  for local-authority proof and an age under 25 and leaves the decision to the
  authority.

## Engine design notes

- Counting adults follows the "who counts" rule: disregarded people are not
  counted when working out whether a household is eligible for 25% or 50%.
- The engine pins the course criteria at 1 year and 21 hours a week (GOV.UK).
  Older guidance quoted 24 hours; the form follows the current GOV.UK page.
- Council Tax Reduction cannot be decided without the authority's local scheme;
  the engine checks completeness only.
