# Uniform Power of Attorney Act (2006) framework

Source: Uniform Law Commission, *Uniform Power of Attorney Act (2006)* (UPOAA);
enacted, with local variations, in a majority of states (Ohio, Washington, and
others). California, New York, Texas, Florida, Illinois, and Pennsylvania have
their own statutes with comparable concepts. Section numbers below are the
uniform text; each state renumbers them.

| Topic | UPOAA | Engine use |
| --- | --- | --- |
| Durability | 104: durable unless it expressly provides it terminates on incapacity. Several non-UPOAA states (TX, CA) require express language. | `durableStatement`; flag `F-DURABILITY-LANGUAGE-001` |
| Execution | 105: signed by the principal (or another in the principal's conscious presence at direction). 105 presumes the signature genuine when acknowledged before a notary; no witness is required by the uniform text. | notary and witness plan vs `STATE_RULES` |
| Effectiveness | 109: effective on execution unless it states a later date or event. A springing power names who determines the event (a designated person, else a physician or licensed psychologist). | `effectiveness`, `springingTrigger` |
| Co-agents, successors | 111 | `coAgentsMode`, `successorAgentName` |
| Compensation | 112: reasonable compensation unless the instrument says otherwise | `compensation` |
| Agent duties | 114: act in good faith, within scope, loyal, keep records | disclaimer text |
| Hot powers | 201(a): need an express grant: create, amend, revoke, or terminate an inter vivos trust; make a gift; create or change rights of survivorship; create or change a beneficiary designation; delegate authority; waive the principal's right to be a beneficiary of a joint and survivor annuity; exercise fiduciary powers the principal could delegate; disclaim property. 201(b): a non-relative agent may not create an interest in the agent or the agent's dependents. | `hot*` fields |
| Gifts | 217: absent a wider grant, limited to the federal gift-tax annual exclusion per donee | `giftLimitType`, flags |
| Acceptance | 119 and 120: a person must accept an acknowledged POA, or request a certification, translation, or opinion of counsel, within seven business days; refusal exposes the person to court order and attorney fees. | `bankFormCompleted`, real-estate flag |

Real-estate recording statutes in every state require an acknowledged
(notarized) instrument, independent of the execution rule for the POA itself.

Confidence: the uniform headings and hot-power list are from the ULC text and
enactments (Idaho, Utah, Wyoming, Michigan, Alabama copies read 2026-11). The
seven-business-day detail is recalled from the uniform text and not re-verified
in this session; the engine does not compute it, only references it.
