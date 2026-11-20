# United Kingdom Last Will and Testament — Reference documentation

Legal and procedural reference material for the will form (England and Wales):
the source instruments, the rules the engine encodes, and design notes. This is
documentation support, not legal advice.

See the form root [`../index.md`](../index.md) for the design description and
[`../spec/index.md`](../spec/index.md) for the contract.

## Sources

| Source | What the form takes from it |
| --- | --- |
| [GOV.UK — Make a will](https://www.gov.uk/make-will) | Purpose of a will; write it yourself but take advice if not straightforward; a will must be formally signed and witnessed; change by codicil or new will; no will means the law decides |
| [GOV.UK — Make sure your will is legal](https://www.gov.uk/make-will/make-sure-your-will-is-legal) | Age 18 or over; two witnesses, both over 18; the testator and witnesses sign the same document; each witness has a clear view of the testator signing; you cannot leave witnesses or their married partners anything; a change follows the same signing and witnessing |
| [Wills Act 1837 s.7, s.9, s.15, s.18, s.18A](https://www.legislation.gov.uk/ukpga/Will4and1Vict/7/26) | Minimum age; in writing and signed in the presence of two witnesses present at the same time; gifts to witnesses fail; marriage revokes unless made in expectation of it; divorce |
| [Inheritance (Provision for Family and Dependants) Act 1975 s.1, s.4](https://www.legislation.gov.uk/ukpga/1975/63) | The classes who may claim reasonable financial provision; the six-month window from the grant of probate |
| [Administration of Estates Act 1925](https://www.legislation.gov.uk/ukpga/Geo5/15-16/23) | Intestacy rules for anything a will does not dispose of; an unmarried partner has no intestacy right |
| [GOV.UK — Inheritance Tax](https://www.gov.uk/inheritance-tax) | £325,000 nil-rate band; the home to children or grandchildren lifts the threshold to £500,000; spouse, civil partner, charity exemption; 40% on the excess; reduced 36% rate with 10% to charity; seven-year rule on gifts |
| [Law Society — Wills and probate](https://www.lawsociety.org.uk/for-the-public/common-legal-issues/wills-and-probate) | When to use a solicitor: a large or complex estate, a blended family, a business, property abroad, doubt over capacity |

## Rules the engine encodes

| Rule | Source | Effect |
| --- | --- | --- |
| Testator under 18 | Wills Act s.7 | formality-risk, high flag |
| Capacity or free choice denied | Common law (*Banks v Goodfellow*), Mental Capacity Act 2005 s.2-3 | formality-risk, high flag |
| Domicile outside England and Wales | Scope of this form | formality-risk, high flag |
| Marriage expected, no contemplation clause | Wills Act s.18 | formality-risk, high flag |
| Witness under 18 | GOV.UK | formality-risk, high flag |
| Witness (or spouse) is a beneficiary | Wills Act s.15, GOV.UK | formality-risk, high flag |
| Signed with fewer than two named witnesses | Wills Act s.9 | formality-risk, high flag |
| Signed but writing, signature, witnesses together, or witnesses signing not confirmed | Wills Act s.9 | formality-risk, high flag |
| No executor | Practice; probate | incomplete, high flag |
| No beneficiary | Practice | incomplete, high flag |
| No residuary clause | Practice; intestacy | incomplete, high flag |
| Shares not 100% | Practice | incomplete, high flag |
| Beneficiary under 18, no trustee | Law of Property Act 1925, Trustee Act; a minor cannot give a valid receipt | incomplete, high flag |
| Capacity or free choice not yet confirmed | Practice | incomplete, medium flag |
| Unmarried partner not a beneficiary | Intestacy; Inheritance Act 1975 s.1(1)(ba) | medium flag |
| Property abroad | Private international law | medium flag |
| Earlier will not revoked | Wills Act s.20 | medium flag |
| Children under 18, no guardian | Children Act 1989 s.5 | medium flag |
| Inheritance Act claims not considered | Inheritance Act 1975 | medium flag |
| Estate above £325,000 | IHTA 1984 | low flag |

## Design notes

- A draft that has not been signed is not a formality failure: the witness
  checks only bite once the status is `signed`, apart from a witness who is a
  beneficiary, who is flagged at once because it is cheap to fix before signing.
- Witness-is-beneficiary is detected by the explicit answer or by a witness
  name that matches a beneficiary name, ignoring case and spacing.
- The testator's age is measured on the date of the will once set, otherwise on
  today's date, so a draft for a 17-year-old turns valid on their 18th birthday.
- The residence nil-rate band, the taper above £2 million, and the 36% rate are
  stated as information only; the form does no tax arithmetic.
- Privileged wills (members of the armed forces on active service, sailors at
  sea) can be made under 18 and without witnesses; the form does not model them.
