# Sensitive categories — federal overlays on HIPAA

HIPAA is a floor, not a ceiling. Several categories of PHI carry
heightened consent requirements imposed by other federal statutes or by
state law. The validity engine treats each category as a separate
yes/no/initials field and as a separate fired-rule predicate.

## 1. Substance-use disorder records — 42 CFR Part 2

Records of the identity, diagnosis, prognosis, or treatment of a
patient maintained in connection with the performance of any federally
assisted substance-use-disorder program are protected by
**42 U.S.C. § 290dd-2** and its implementing regulations at
**42 CFR Part 2**.

A HIPAA authorization that includes substance-use records must
additionally contain:

- An explicit description of the substance-use information to be
  disclosed (Part 2 §§ 2.31(a)(3) and (4)).
- A statement that the information is being disclosed from records
  protected by Part 2.
- The **Part 2 prohibition-on-redisclosure notice**:

  > This information has been disclosed to you from records protected
  > by federal confidentiality rules (42 CFR Part 2). The federal rules
  > prohibit you from making any further disclosure of information in
  > this record that identifies a patient as having or having had a
  > substance use disorder either directly, by reference to publicly
  > available information, or through verification of such
  > identification by another person unless further disclosure is
  > expressly permitted by the written consent of the individual whose
  > information is being disclosed or as otherwise permitted by 42 CFR
  > Part 2.

If the patient's "drug or alcohol treatment / referral" record category
is marked **Yes**, the engine fires `substance-use-part-2-consent`
unless the redisclosure notice is recorded as included.

## 2. HIV/AIDS records — state law

There is no single federal statute governing HIV/AIDS disclosure;
instead, every US state has its own statute. Examples:

- **New York Article 27-F** (Public Health Law §§ 2780–2787): requires
  a specific HIV release form (DOH-2557 or equivalent) and a notice
  warning recipients against further disclosure.
- **California Health & Safety Code § 120975**: written authorization
  is required, with very narrow exceptions.
- **Florida § 381.004**: written informed consent is required for HIV
  testing, with separate release requirements.

The engine raises a high-priority flag when HIV/AIDS records are
included without the state-specific consent language.

## 3. Mental-health records

Most states require mental-health records to be authorised by a
*separate*, *initialled* field. A single global checkbox is treated as
medium-priority by the engine.

## 4. Psychotherapy notes — 45 CFR § 164.508(a)(2)

> A covered entity must obtain an authorization for any use or
> disclosure of psychotherapy notes, except: …

Psychotherapy notes are **not** ordinarily authorised by the same form
that authorises other PHI. Combining them is a compound authorization
prohibited by § 164.508(b)(3) except for use in the treatment of
counselling. The engine fires `psychotherapy-separate-auth` when
psychotherapy notes are released alongside any other category.

## 5. Genetic information — GINA (Public Law 110-233)

The Genetic Information Nondiscrimination Act restricts use of genetic
information by health plans and employers but does not impose
authorization-form requirements beyond HIPAA. The engine raises a
low-priority flag when genetic information is released, so that the
disclosing provider is reminded that downstream use by an employer or
underwriter is restricted regardless of the authorization.

## 6. VA records — 38 U.S.C. § 7332

Records of drug abuse, alcoholism, infection with HIV, or sickle-cell
anaemia maintained by the US Department of Veterans Affairs are
protected by 38 U.S.C. § 7332 in addition to HIPAA. The engine raises
a high-priority flag when the disclosing source is identified as a VA
facility and the § 7332 notice is not included.

## 7. Reproductive-health information — HHS 2024 rule

The HHS *Final Rule to Support Reproductive Health Care Privacy* (89
Fed. Reg. 32976, April 26, 2024) prohibits a covered entity from using
or disclosing PHI for an investigation into, or proceeding against,
lawful reproductive health care. The engine raises a flag when the
stated purpose appears to be an investigation of reproductive-health
care.
