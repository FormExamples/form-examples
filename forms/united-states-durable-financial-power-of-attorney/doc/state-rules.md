# State rules table

The engine's `STATE_RULES` encodes, per state: governing citation, UPOAA status,
notary requirement (`required`, `recommended`, or `either` meaning notary or
witnesses), witness count, whether the notary may count as a witness, springing
policy, durability default, Florida-style hot-power initials, agent-signature
timing, and mandatory notice text. Unknown states use the `DEFAULT` row (the
uniform text: notary recommended, no witness, springing allowed, durable by
default) and raise `F-STATE-RULE-VERIFY-001`.

| State | Citation | Notary | Witnesses | Notary counts | Springing | Durable default | Initials | Agent signature | Notice | Confidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| CA | Cal. Prob. Code 4121-4124, 4264 | either | 2 | no | allowed | express statement | no | none | yes | statute text via secondary summary (4121, 4122) |
| NY | N.Y. Gen. Oblig. Law 5-1501B | required | 2 | yes | allowed | default durable | no | effectiveness | yes | read from nysenate.gov |
| TX | Tex. Est. Code ch. 751, 752 | required | 0 | no | allowed | express statement | no | none | no | 751.0021 read (signed, acknowledged, durability words, no witnesses) |
| FL | Fla. Stat. 709.2105, 709.2108, 709.2202 | required | 2 | no | prohibited | default durable | yes | none | no | 709.2105, 709.2108(3) (springing ineffective), and 709.2202 read |
| IL | 755 ILCS 45/3-3, 3-3.6 | required | 1 | no | allowed | default durable | no | none | no | secondary summaries; notary cannot be the witness |
| PA | 20 Pa.C.S. 5601 (Act 95 of 2014) | required | 2 | no | allowed | default durable | no | before-acting | yes | secondary summaries |
| OH | Ohio R.C. 1337.21-1337.64; 5301.01 | recommended | 0 | no | allowed | default durable | no | none | no | 1337.25 read; real-estate acknowledgment under 5301.01 |
| WA | RCW 11.125.050, 11.125.090 | required | 0 | no | allowed | default durable | no | none | no | secondary summary of 11.125.050 |

Hot-power express-grant statutes: Cal. Prob. Code 4264; N.Y. Gen. Oblig. Law
5-1502 and the 2021 gift provisions; Tex. Est. Code 751.031; Fla. Stat. 709.2202
(signature or initials beside each power, read); 20 Pa.C.S. 5601; RCW 11.125.160;
Ohio R.C. 1337.34; 755 ILCS 45/4-5 (gifts). The engine treats every state alike:
a hot power must be an affirmative `yes`.

Out-of-table states: verify locally. Every rule here must be re-verified against
the current statute before reliance; amendments are frequent.

## Sources read

- N.Y. Gen. Oblig. Law 5-1501B: https://www.nysenate.gov/legislation/laws/GOB/5-1501B
- Fla. Stat. 709.2105: https://www.flsenate.gov/Laws/Statutes/2024/709.2105
- Fla. Stat. 709.2202: https://www.flsenate.gov/Laws/Statutes/2024/709.2202
- Tex. Est. Code 751.0021: https://texas.public.law/statutes/tex._est._code_section_751.0021
- Ohio R.C. 1337.25: https://codes.ohio.gov/ohio-revised-code/section-1337.25
- RCW 11.125.050: https://app.leg.wa.gov/rcw/default.aspx?cite=11.125
- Cal. Prob. Code 4121-4124: https://california.public.law/codes/probate_code_section_4121
- 755 ILCS 45/3-3: https://ilga.gov/legislation/ilcs/documents/075500450K3-3.htm
- 20 Pa.C.S. Ch. 56: https://www.palegis.us/statutes/consolidated/view-statute?txtType=HTM&ttl=20&div=0&chapter=56&section=1&subsctn=0
