# Assessment protocol

This document describes the clinical workflow the questionnaire implements.
The form is intended to support — not replace — a face-to-face or remote
consultation with an appropriately trained clinician (general practitioner,
practice nurse, FSRH-trained doctor or nurse, or sexual and reproductive
health specialist).

## Intended user and setting

- **User**: patient (self-reported) or clinician (proxy)
- **Setting**: UK primary care, integrated sexual health (ISH) clinic,
  community contraception clinic, or termination of pregnancy service
- **Episode**: pre-prescribing assessment for hormonal or intrauterine
  contraception, or annual review

## Workflow

1. **Demographics** — name, date of birth, GP, ethnicity. Captured for
   matching to electronic patient records.
2. **Menstrual history** — last menstrual period (LMP), cycle length, bleeding
   pattern, dysmenorrhoea, intermenstrual or post-coital bleeding. Abnormal
   bleeding is flagged for review before LARC fitting.
3. **Contraceptive history** — current method, prior methods, reasons for
   discontinuation, adherence. Records any prior method failure.
4. **Medical history** — conditions screened against UKMEC: hypertension,
   diabetes, ischaemic heart disease, stroke, liver disease, breast cancer,
   gallbladder disease, inflammatory bowel disease, SLE, sickle cell, HIV.
5. **Cardiovascular risk** — blood pressure, BMI, smoking status, age, family
   history. Drives the CHC and POI risk categorization.
6. **Thromboembolism risk** — personal or family VTE, immobility, recent or
   planned surgery, thrombophilia, known thrombogenic mutations.
7. **Current medications** — focused on UKMEC-relevant interactions:
   enzyme-inducing antiepileptics, rifampicin/rifabutin, St John's wort,
   antiretrovirals, lamotrigine, certain antifungals. Aligned with the FSRH
   *Drug Interactions with Hormonal Contraception* guideline.
8. **Lifestyle** — smoking (pack-years), alcohol units/week, recreational
   drugs, exercise, occupation.
9. **Contraceptive preferences** — desired duration, hormone tolerance, prior
   experiences, partner involvement, religious or cultural considerations.
10. **Clinical recommendation** — engine generates a per-method UKMEC
    category and a shortlist of methods sorted by suitability.

## Safety-net rules

The grader will flag the consultation for clinician override (rather than
issue a recommendation) when any of the following are true:

- Any UKMEC 4 condition identified
- Two or more UKMEC 3 conditions identified
- Blood pressure not measured in the last 12 months for CHC users
- BMI ≥35 kg/m² (UKMEC 3 for CHC and recommends review)
- Migraine with aura screened positive
- Suspected pregnancy (LMP > 28 days ago with no contraception in place)
- Postnatal < 6 weeks and considering CHC (UKMEC 4)

## Documentation

The form generates a structured PDF report listing UKMEC categories per
method, flagged issues, and the rationale. The report is suitable for
attaching to SystmOne, EMIS Web, or Vision records under a "Contraception
assessment" entry.

## Out-of-protocol scenarios

The form does not provide:

- Emergency contraception dosing
- Termination of pregnancy assessment
- STI screening or treatment protocols
- Cervical screening recall management
- Subfertility assessment (see the separate `fertility-assessment` form)
