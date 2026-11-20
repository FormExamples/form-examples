# United Kingdom Last Will and Testament

A will-drafting documentation instrument for **England and Wales**. The person
preparing a will records the testator, the estate, the executors, the
beneficiaries and their shares, guardians for children under 18, funeral
wishes, and how the will is to be signed and witnessed. The engine checks the
record against the **Wills Act 1837** formalities and basic completeness, and
tells the person whether the will looks ready to sign.

**This is documentation support, not legal advice.** It does not draft the
legal wording of a will, it cannot confirm that a will is valid, and it does
not replace a solicitor or a regulated will writer. GOV.UK says you can write a
will yourself but should take advice if it is not straightforward.

The form is not a numeric score. Its engine is a **completeness and validity
engine**: it classifies the will as **Valid** (ready to execute), **Incomplete**,
or **Formality risk** (the will may be invalid or a gift may fail), and raises
flagged issues.

## Scope and intended users

- **Setting:** anyone in England and Wales making or reviewing a will; will
  writers, solicitors' assistants, and charity will-month volunteers.
- **Users:** the testator, or a person helping them, who then takes the result
  to a solicitor or signs the will with two independent adult witnesses.
- **Law:** England and Wales only. Scotland and Northern Ireland have different
  rules, and property abroad may follow foreign succession law. The engine
  flags both.
- **Not for:** drafting the will text, probate, tax computation, trusts of
  complex shape, business or agricultural property relief, or a will for
  someone who lacks capacity (that needs the Court of Protection).

## Sections and validity model

The wizard has six sections plus a summary, on one continuous single page.

| # | Section | What it records |
| --- | --- | --- |
| 1 | The testator | Name, date of birth, address, domicile, marital status, expected marriage, capacity, free choice, earlier will |
| 2 | The estate | Value band, home, charity share, property abroad, specific gifts |
| 3 | Executors | Up to two executors and whether they are adult and willing |
| 4 | Beneficiaries and residuary estate | Up to four beneficiaries with a percentage share, age, trustee; residuary clause; Inheritance Act claims considered |
| 5 | Guardians and funeral wishes | Children under 18, guardian, funeral wishes |
| 6 | Signing and witnessing | Draft or signed, date, in writing, signature, two witnesses together, witness age and beneficiary status |
| 7 | Summary and validity | Live class, share total, witness count |

**Validity classes.** The engine assigns exactly one:

| Class | Meaning |
| --- | --- |
| Valid | No formality problem and no missing content. Ready to sign in front of two independent adult witnesses (or recorded as correctly signed). Still not confirmed valid by a lawyer. |
| Incomplete | Content is missing and the same person can complete it: no executor, no beneficiary, no residuary clause, shares that do not total 100%, a beneficiary under 18 with no trustee, testator name or date of birth missing, or capacity and free choice not yet confirmed. |
| Formality risk | A rule that can make the will invalid or a gift fail is broken or at risk: testator under 18, capacity or free choice denied, domicile outside England and Wales, expected marriage without a contemplation clause, a witness under 18, a witness (or their spouse) who is a beneficiary, a will recorded as signed with fewer than two witnesses, or signing steps not in order. |

`formality-risk` takes precedence over `incomplete`: completing the content does
not make a will safe to sign if the formalities are broken.

**Flagged issues.** Raised independently of the class, each with a priority:

- **High:** testator under 18; capacity or voluntariness denied; domicile
  outside England and Wales; marriage would revoke the will; witness under 18;
  witness is a beneficiary; fewer than two witnesses; execution not in order;
  no executor; no beneficiary; residuary clause missing; shares not 100%; minor
  beneficiary without a trustee.
- **Medium:** capacity not confirmed; testator details missing; unmarried
  partner not provided for; property in another jurisdiction; earlier will not
  revoked; children under 18 with no guardian; Inheritance Act 1975 claims not
  considered.
- **Low:** witnesses not yet arranged; executors not confirmed adult;
  inheritance tax note (estate above the nil-rate band); funeral wishes not
  recorded; date of will missing.

## Legal grounding (England and Wales)

- **Wills Act 1837 s.7:** a will made by a person under 18 is not valid (narrow
  exceptions for privileged wills).
- **s.9:** a will must be in writing, signed by the testator (or by someone
  else in their presence and at their direction), the signature intended to give
  effect to the will, made or acknowledged in the presence of two or more
  witnesses present at the same time, each of whom then signs or acknowledges
  their signature in the testator's presence.
- **s.15:** a gift to a witness, or to a witness's spouse or civil partner,
  fails. GOV.UK: you cannot leave your witnesses, or their married partners,
  anything in your will.
- **s.18:** marriage or civil partnership revokes a will unless it was made in
  expectation of that marriage and says so. **s.18A:** divorce or dissolution
  treats the former spouse as having died before the testator.
- **Inheritance (Provision for Family and Dependants) Act 1975:** a spouse or
  civil partner, former partner, partner of two years or more, a child, a child
  of the family, or anyone maintained by the deceased may apply to the court
  within six months of the grant of probate if the will leaves no reasonable
  financial provision.
- **Administration of Estates Act 1925:** the intestacy rules apply to anything
  the will does not dispose of. An unmarried partner inherits nothing on
  intestacy.
- **Inheritance Tax:** the nil-rate band is £325,000; a residence nil-rate band
  of up to £175,000 applies when the home passes to children or grandchildren
  (tapered for estates above £2 million); the spouse, civil partner and charity
  exemptions; 40% on the excess; a reduced 36% rate when at least 10% of the net
  estate goes to charity; gifts in the seven years before death may be taxed.
- **Changing a will:** a codicil or a new will, each signed and witnessed the
  same way.

See [`doc/index.md`](./doc/index.md) for the sources and citations.

## Conventions

- Text and enum fields default to `''`; numeric and date fields default to
  `null`.
- The wizard is one continuous single-page form with a sticky progress summary.
- Four beneficiary slots (`First` to `Fourth`), two executor slots and two
  witness slots keep the SQL flat; a will with more people needs a solicitor.

## Artefacts

`sql/` is the source of truth; `xml/`, `fhir/`, `protobuf/`, `openapi/` and the
Axum setup script are generated from it. `front-end-with-html/` and
`front-end-with-svelte/` are the two wizards with a wills dashboard;
`back-end-with-axum/` is the JSON API; `examples/personas.json` holds eleven
personas that pin the engine's class and flags.

## Compliance

UK GDPR and the Data Protection Act 2018 for personal and family data; WCAG 2.2
AA accessibility; ISO/IEC/IEEE 26514:2022 for user information. This is not a
medical device, and it is not a regulated legal service.

## References

- [GOV.UK — Make a will](https://www.gov.uk/make-will)
- [GOV.UK — Make sure your will is legal](https://www.gov.uk/make-will/make-sure-your-will-is-legal)
- [GOV.UK — Inheritance Tax](https://www.gov.uk/inheritance-tax)
- [Wills Act 1837](https://www.legislation.gov.uk/ukpga/Will4and1Vict/7/26)
- [Inheritance (Provision for Family and Dependants) Act 1975](https://www.legislation.gov.uk/ukpga/1975/63)
- [Law Society — Wills and probate](https://www.lawsociety.org.uk/for-the-public/common-legal-issues/wills-and-probate)
