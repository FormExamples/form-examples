# IHR Annex 6 — legal basis for the ICVP

## Source

The model International Certificate of Vaccination or Prophylaxis (ICVP) is
defined in **Annex 6** of the **International Health Regulations (2005),
Third Edition** (referred to here as the **IHR**), the binding international
legal instrument administered by the World Health Organization.

- World Health Organization. *International Health Regulations (2005),
  Third Edition*. Geneva: WHO, 2016.
  <https://www.who.int/publications/i/item/9789241580496>

The IHR are binding on all 196 WHO Member States and Liechtenstein, the
Holy See, and certain other parties. Annex 6 governs the form, language,
validity, and acceptance of vaccination certificates required for
international travel.

## Annex 6 mandatory elements

The certificate is a printed two-page document (typically A6 booklet
format). Each entry on the certificate must contain:

1. The disease for which the certificate is issued.
2. The vaccine or prophylaxis administered.
3. The date of vaccination or prophylaxis (day in figures, month in letters,
   year in figures).
4. The signature in **handwriting** of the supervising clinician — **not a
   facsimile, not a stamp**.
5. The professional status of the supervising clinician.
6. The **manufacturer** and **batch number** of the vaccine.
7. The period of validity (start and end dates).
8. The **official stamp** of the administering centre — must be a uniform
   stamp registered with the national health authority. The clinician's
   personal stamp is **not** acceptable.

## Language requirements

Annex 6 requires the certificate to be issued in **English and French**, plus
the issuing country's official language(s). The form's HTML and Svelte
templates expose a `lang` slot for the secondary language.

## Currently mandated diseases

As of the 2016 IHR amendment:

- **Yellow fever** is the only disease for which a certificate of
  vaccination may be required as a condition of entry by a State Party
  (Annex 7, IHR).
- **Polio** vaccination certificates have been issued under WHO temporary
  recommendations during the polio Public Health Emergency of International
  Concern declared 5 May 2014 and renewed periodically. See:
  <https://www.who.int/news-room/events/detail/2024/01/05/default-calendar/thirty-eighth-meeting-of-the-international-health-regulations-(2005)-emergency-committee-regarding-the-international-spread-of-poliovirus>

The form's data model accepts any disease so it can be reused for future
PHEIC temporary recommendations.

## Yellow fever validity (2016 IHR amendment)

WHO updated the yellow fever vaccination position in 2014 (WHO Position
Paper, June 2013) and the IHR Annex 7 was amended in 2016 to remove the
10-year booster requirement:

- WHO. *Vaccines and vaccination against yellow fever: WHO Position Paper,
  June 2013*. Weekly Epidemiological Record 2013;88:269-283.
  <https://www.who.int/publications/i/item/who-wer-8827>
- WHO. *Yellow fever vaccination booster not needed* (2014).
  <https://www.who.int/news/item/17-05-2014-who-yellow-fever-vaccination-booster-not-needed>

Operational consequences:

- Validity starts **10 days after vaccination**.
- Validity is for the **lifetime of the vaccinee**.
- An expiry date printed on the certificate before the 2016 amendment must
  be honoured for travel; State Parties are required to accept the
  certificate as valid for the lifetime of the vaccinee.

## Medical waiver

Annex 6 permits a **medical contraindication waiver** signed by the
supervising clinician where vaccination is contraindicated for medical
reasons. The destination State Party may decline to accept the waiver.

Common yellow fever contraindications recorded by the form:

- Age < 9 months.
- Age > 60 years (relative contraindication; senior clinician sign-off).
- Pregnancy or breastfeeding.
- Severe immunosuppression (HIV CD4 < 200, solid-organ transplant within
  2 years, on biologics).
- Thymus disorders (history of thymectomy, thymoma, DiGeorge syndrome).
- Severe egg allergy / hypersensitivity to vaccine component.

## CDC operational guidance (US)

- CDC. *International Certificate of Vaccination or Prophylaxis (ICVP)*.
  <https://wwwnc.cdc.gov/travel/page/icvp>
- CDC. *Yellow Book — Health Information for International Travel*.
  <https://wwwnc.cdc.gov/travel/page/yellowbook-home>

## See also

- [yellow-fever-vaccination.md](yellow-fever-vaccination.md)
- [safety-case-notes.md](safety-case-notes.md)
- [references.md](references.md)
