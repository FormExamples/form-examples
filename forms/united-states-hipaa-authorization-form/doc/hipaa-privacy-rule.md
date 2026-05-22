# HIPAA Privacy Rule — § 164.508 core elements and required statements

This document quotes the canonical text of 45 CFR § 164.508 that drives
the validation engine. Quotations are from the **Code of Federal
Regulations** as updated through the Final Modifications to the HIPAA
Privacy, Security, Enforcement, and Breach Notification Rules (78 Fed.
Reg. 5566, Jan. 25, 2013).

## § 164.508(a) — Standard: Authorizations for uses and disclosures

> Except as otherwise permitted or required by this subchapter, a
> covered entity may not use or disclose protected health information
> without an authorization that is valid under this section.

## § 164.508(b) — Implementation specifications

### (b)(1) Valid authorizations

> A valid authorization is a document that meets the requirements in
> paragraphs (a)(3)(ii), (a)(4)(ii), (c)(1), and (c)(2) of this section,
> as applicable.

### (b)(2) Defective authorizations

An authorization is **not valid** if any of the following defects are
present:

> (i)  The expiration date has passed or the expiration event is known
>      by the covered entity to have occurred;
> (ii) The authorization has not been filled out completely, with
>      respect to an element described by paragraph (c) of this section,
>      if applicable;
> (iii) The authorization is known by the covered entity to have been
>       revoked;
> (iv) The authorization violates paragraph (b)(3) or (4) of this
>      section, if applicable;
> (v)  Any material information in the authorization is known by the
>      covered entity to be false.

### (b)(3) Compound authorizations — *prohibited*

> An authorization for use or disclosure of protected health information
> may not be combined with any other document to create a compound
> authorization, except as follows: …

The validation engine flags any compound authorization that does not
fall within the narrow research, clinical-trial, or psychotherapy-notes
exceptions.

### (b)(4) Prohibition on conditioning

> A covered entity may not condition the provision to an individual of
> treatment, payment, enrollment in the health plan, or eligibility for
> benefits on the provision of an authorization, except: …

The engine fires `no-conditioning-statement` if the authorization does
not include the prohibition-on-conditioning notice required by
(c)(2)(ii).

## § 164.508(c)(1) — Core elements

A valid authorization must contain *all* of the following six core
elements:

| # | Citation     | Plain-language requirement |
| - | ------------ | -------------------------- |
| 1 | (c)(1)(i)    | "A description of the information to be used or disclosed that identifies the information in a specific and meaningful fashion." |
| 2 | (c)(1)(ii)   | "The name or other specific identification of the person(s), or class of persons, authorized to make the requested use or disclosure." |
| 3 | (c)(1)(iii)  | "The name or other specific identification of the person(s), or class of persons, to whom the covered entity may make the requested use or disclosure." |
| 4 | (c)(1)(iv)   | "A description of each purpose of the requested use or disclosure. The statement 'at the request of the individual' is a sufficient description of the purpose when an individual initiates the authorization and does not, or elects not to, provide a statement of the purpose." |
| 5 | (c)(1)(v)    | "An expiration date or an expiration event that relates to the individual or the purpose of the use or disclosure. The statement 'end of the research study,' 'none,' or similar language is sufficient if the authorization is for a use or disclosure of protected health information for research, including for the creation and maintenance of a research database or research repository." |
| 6 | (c)(1)(vi)   | "Signature of the individual and date. If the authorization is signed by a personal representative of the individual, a description of such representative's authority to act for the individual must also be provided." |

## § 164.508(c)(2) — Required statements

The authorization must contain statements adequate to put the individual
on notice of:

| # | Citation     | Plain-language requirement |
| - | ------------ | -------------------------- |
| 1 | (c)(2)(i)    | "The individual's right to revoke the authorization in writing, and either: (A) the exceptions to the right to revoke and a description of how the individual may revoke the authorization; or (B) … reference to the covered entity's notice of privacy practices." |
| 2 | (c)(2)(ii)   | "The ability or inability to condition treatment, payment, enrollment, or eligibility for benefits on the authorization, by stating either: (A) the covered entity may not condition … ; or (B) the consequences to the individual of a refusal to sign … when, in accordance with paragraph (b)(4) of this section, the covered entity can condition …" |
| 3 | (c)(2)(iii)  | "The potential for information disclosed pursuant to the authorization to be subject to redisclosure by the recipient and no longer be protected by this subpart." |

## § 164.508(c)(3) — Plain-language requirement

> The authorization must be written in plain language.

The validation engine does not enforce plain language algorithmically;
it raises a low-priority flag if the PHI description contains specific
medical jargon or non-standard abbreviations that would not be
understood by a lay reader.

## § 164.508(c)(4) — Copy to the individual

> If a covered entity seeks an authorization from an individual for a
> use or disclosure of protected health information, the covered entity
> must provide the individual with a copy of the signed authorization.
