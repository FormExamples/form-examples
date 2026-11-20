# United States Last Will and Testament: research and citations

Reference notes behind `spec/index.md` and the engine's `STATE_RULES` table.
This is documentation support, not legal advice. Will law is state law and
changes: every row below says whether the rule was read from a primary source
while building this form or is summarized from the drafter's knowledge of the
statute and still needs checking against the current text.

## Uniform Probate Code (the default rule)

| Rule | Source | Status |
| --- | --- | --- |
| Capacity: a testator is 18 or older and of sound mind (UPC 2-501) | Uniform Probate Code Article II, as enacted in [Utah Code 75-2-501 to 75-2-505](https://le.utah.gov/xcode/Title75/Chapter2/C75-2-P5_1800010118000101.rtf) and [Maine 18-C section 2-502](https://legislature.maine.gov/statutes/18-C/title18-Csec2-502.html) | Read in search results; state enactments differ in wording |
| Execution: a writing signed by the testator and by at least two individuals who each witnessed the signing or the testator's acknowledgment, within a reasonable time (UPC 2-502); a holographic will is valid if the signature and material portions are in the testator's handwriting (2-502(b)) | Same | Read |
| Harmless error: a document not executed correctly may still be treated as a will on clear and convincing evidence of intent (2-503) | UPC Article II | Recalled; the engine does not rely on it and still flags defects |
| Self-proved will: acknowledgment by the testator and affidavits of the witnesses before an officer authorized to administer oaths (2-504) | Utah Code 75-2-504 | Read |
| Interested witness: signing by an interested witness does not invalidate the will or any provision (2-505) | Utah Code 75-2-505 | Read |
| Elective share of the surviving spouse: up to 50% of the augmented estate (2-202); the engine uses 50% as an approximate upper bound for unlisted states | UPC 2-202 | Recalled; flagged "approximate" |
| Penalty clause for contest unenforceable if probable cause exists (3-905) | UPC 3-905 | Recalled |

## Federal and state estate tax (2026 deaths)

| Rule | Source | Status |
| --- | --- | --- |
| Federal basic exclusion amount $15,000,000 for 2026 | [Kiplinger, 2026 estate tax exemption](https://kiplinger.com/taxes/new-estate-tax-exemption-amount); [Faegre Drinker, 2026 estate tax exemption](https://faegredrinker.com/en/insights/publications/2026/1/2026-estate-tax-exemption-and-planning-considerations) | Read in search results |
| New York exclusion $7,350,000 for 2026 (with the 105% "cliff") | [AARP, states with estate and inheritance taxes](https://www.aarp.org/money/retirement/states-with-estate-inheritance-taxes/) | Read in search results |
| Illinois exclusion $4,000,000, not portable | AARP (above); [Wealthspire 2026 cheat sheet](https://www.wealthspire.com/blog/federal-state-estate-gift-tax/) | Read in search results |
| Washington exclusion about $3,000,000 (a figure near $3,076,000 applied for part of 2026) | AARP (above); [Washington Department of Revenue 2026 notice](https://dor.wa.gov/sites/default/files/2026-01/EstateTaxExclusionAmount2026.pdf) | Sources conflict on the date; the engine uses $3,000,000 |
| Pennsylvania has an inheritance tax, not an estate tax; Florida, Texas, California and Ohio have neither | Drafter's knowledge | Recalled; verify |

## State rules (the STATE_RULES table)

| State | Rule | Citation | Status |
| --- | --- | --- | --- |
| WA | Interested witness: no invalidity; unless two other disinterested witnesses signed, a gift raises a rebuttable presumption of duress, menace, fraud or undue influence, and the witness keeps at most the intestate share | [RCW 11.12.160](https://lawfilesext.leg.wa.gov/law/RCW/RCW%20%2011%20%20TITLE/RCW%20%2011%20.%2012%20%20CHAPTER/RCW%20%2011%20.%2012%20.160.htm) | Read |
| FL | Interested witness: the will and its provisions are not invalid because an interested witness signed | [Fla. Stat. 732.504](http://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&URL=0700-0799/0732/Sections/0732.504.html) | Read |
| TX | Interested witness: a gift to a subscribing witness is void if the will cannot otherwise be established, except up to the intestate share, unless a disinterested credible person corroborates the witness | [Tex. Est. Code 254.002](https://texas.public.law/statutes/tex._est._code_section_254.002) | Read |
| OH | Interested witness: a gift to one of only two witnesses is void, except up to the intestate share | [Ohio R.C. 2107.15](https://codes.ohio.gov/ohio-revised-code/section-2107.15) | Read |
| NY | Interested witness: a gift is void unless at least two other disinterested attesting witnesses signed; the witness may recover up to the intestate share | [N.Y. EPTL 3-3.2](https://www.nysenate.gov/legislation/laws/EPT/3-3.2) | Read |
| CA | Interested witness presumption of undue influence (Prob. Code 6112); holographic wills (6111); witnessed will and attestation under penalty of perjury (6110); no-contest clause limits (21310 to 21315); community property | Cal. Prob. Code | Recalled; verify |
| IL | Beneficiary-witness legacy void unless the will is otherwise attested by enough witnesses (755 ILCS 5/4-6); witnesses sign in the testator's presence (4-3); attestation clause or affidavit proves the will (6-4); elective share one third with descendants, one half without (2-8); electronic wills under the Electronic Wills and Remote Witnesses Act | 755 ILCS 5 | Recalled; the statute page could not be fetched; verify |
| PA | Holographic wills allowed with handwriting proof; signed at the end (20 Pa.C.S. 2502); interested witness (2505); self-proving affidavit (3132.1); elective share one third (2203); inheritance tax | 20 Pa.C.S. | Recalled; verify. The engine uses the two-other-witnesses outcome as an approximation of 2505 |
| OH | Two witnesses subscribe in the testator's presence (2107.03); Ohio does not use a self-proving affidavit; elective share is the intestate share capped at one half of the net estate (2106.01) | Ohio R.C. | Recalled; the engine treats the cap as an approximate upper bound |
| NY | Holographic wills only for military in actual service and mariners at sea (3-2.2); elective share the greater of $50,000 or one third (5-1.1-A); no-contest clauses permitted subject to exceptions (3-3.5); self-proving affidavit before a notary (SCPA 1406) | N.Y. EPTL, SCPA | Recalled; verify |
| TX | Two witnesses sign in the testator's presence (251.051); holographic will wholly in handwriting (251.052); self-proved by affidavit (251.101 to 251.107); no-contest good-faith exception (254.005); community property | Tex. Est. Code | Recalled; verify |
| FL | Two witnesses sign in the presence of the testator and each other (732.502); no holographic will; self-proof (732.503); elective share 30% (732.201 and following); no-contest clause unenforceable (732.517); electronic wills (732.522) | Fla. Stat. | Recalled; verify |
| WA | Two witnesses (11.12.020); self-proving affidavit (11.20.020); community property | RCW | Recalled; verify |
| Electronic wills | Florida and Illinois are recorded as allowing a fully electronic will; every other table state is recorded as not allowing one, which is the conservative reading. The Uniform Electronic Wills Act (2019) is enacted in some other states | Uniform Law Commission | Recalled; verify before relying on it |

## Digital assets

Almost every state has enacted the Revised Uniform Fiduciary Access to Digital
Assets Act (RUFADAA, 2015): without the testator's consent in the will, a
personal representative generally receives a catalogue of electronic
communications, not their content. F-WILL-029 recommends an explicit clause.

## Community property

California, Texas and Washington (in the table) are community property states,
as are Arizona, Idaho, Louisiana, Nevada, New Mexico and Wisconsin. The surviving
spouse already owns half of the community property, so the elective-share check
does not apply; F-WILL-017 reminds the drafter to classify assets.

## Limits of this tool

It does not draft will text, interpret ambiguous clauses, apply the
augmented-estate rules, check for a pretermitted spouse, or consider trusts,
non-probate transfers, or creditor claims. A will can pass these checks and
still fail in court. A licensed attorney in the testator's state should review
it before signing.
