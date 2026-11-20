# State rules: sources and confidence

Values encoded in `STATE_RULES` (`front-end-with-html/js/rules.js`,
`front-end-with-svelte/src/lib/engine/rules.ts`). "Verified" means the value was
read from the statute text or an official summary; "secondary" means a reliable
secondary source agreed but the statute text itself was not re-read; verify
before relying on it.

| State | Rule values | Source | Confidence |
| --- | --- | --- | --- |
| CA | 2 witnesses or a notary acknowledgment; at least one witness neither related by blood, marriage, or adoption nor an heir under an existing will; provider and facility staff cannot witness; a skilled-nursing resident needs a patient advocate or ombudsman witness | Cal. Prob. Code 4673, 4674, 4675 (leginfo.legislature.ca.gov); agent limit 4659 | Secondary (findlaw, public.law, state AG form) |
| NY | Principal signs before 2 adult witnesses; the agent cannot witness; no notary route; a hospital operator, administrator, or employee cannot be agent for a patient there unless related; additional witnesses for mental hygiene facility residents | N.Y. Pub. Health Law 2981 (nysenate.gov) | Verified |
| TX | 2 competent adult witnesses or a notary acknowledgment; at least one witness must not be the agent, a relative, an heir, a creditor of the estate, the attending physician or its employee, a direct-care employee of the facility, or facility officer or business-office staff | Tex. Health & Safety Code 166.003, 166.154, 166.164 (statutes.capitol.texas.gov) | Verified for 166.003; secondary for the notary alternative |
| FL | 2 adult witnesses; the surrogate cannot witness; at least one witness neither spouse nor blood relative; no notary route | Fla. Stat. 765.202 (leg.state.fl.us) | Verified |
| IL | 1 adult witness; not the agent or a treating professional or facility owner or operator; relatives by blood, marriage, or adoption excluded; notarization not required | 755 ILCS 45/4-5.1, 4-10 (ilga.gov) | Secondary (full list not re-read); heir exclusion not encoded |
| PA | 2 adult witnesses; the person who signs for the principal cannot witness; notarization not required | 20 Pa.C.S. 5452 | Secondary; whether the agent may witness is disputed, so the engine bars the agent everywhere as best practice |
| OH | 2 adult witnesses or a notary; relatives by blood, marriage, or adoption, the agent, the attending physician, and a nursing home administrator cannot witness | Ohio Rev. Code 1337.12 (codes.ohio.gov) | Secondary (summary of current text) |
| WA | Acknowledgment before a notary or 2 competent witnesses who are not the principal's care providers; relatives excluded | RCW 11.125.050 (leg.wa.gov) | Secondary; note Washington's health care directive and living-will rules (RCW 70.122) were not verified |

Unknown state: the uniform default (2 witnesses or a notary; at least one
unrelated witness; no provider witnesses; agent not the treating provider) and
flag `F-HCPOA-012`.

## Deliberate simplifications

- The agent is barred as a witness in every state, including Pennsylvania.
- `agentProviderBar` is encoded only for CA and TX (treating provider or its
  employee, unrelated); NY's hospital-employee limit is covered by the shared
  facility-employee check.
- Remote online notarization and remote witnessing (NY allows audio-video
  witnessing under conditions) are out of scope.
- Fees and waiting periods do not apply to this document.
