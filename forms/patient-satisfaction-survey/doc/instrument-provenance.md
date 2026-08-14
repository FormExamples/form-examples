# Instrument provenance — Patient Satisfaction Survey

This survey is a composite, broadly modelled on three families of
internationally used patient-experience instruments:

## PSQ-18

- Marshall GN, Hays RD. *The Patient Satisfaction Questionnaire
  Short-Form (PSQ-18).* RAND Corporation, 1994. Report no. P-7865.
  <https://www.rand.org/pubs/papers/P7865.html>
- RAND Health Care. *Patient Satisfaction Questionnaire.*
  <https://www.rand.org/health-care/surveys_tools/psq.html>

PSQ-18 contributes the multi-domain agreement-scale architecture and
the *General Satisfaction* subscale.

## HCAHPS and CG-CAHPS (CAHPS family)

- Centers for Medicare & Medicaid Services. *HCAHPS.*
  <https://hcahpsonline.org/>
- AHRQ. *CAHPS Clinician & Group survey (CG-CAHPS).*
  <https://www.ahrq.gov/cahps/surveys-guidance/cg/index.html>
- AHRQ. *CAHPS family of surveys.*
  <https://www.ahrq.gov/cahps/index.html>

HCAHPS contributes the *Overall hospital rating* item and the
*Communication with Doctors / Nurses* domain structure. The
normalized 0–100 composite score is a CAHPS-style transformation of
the raw Likert mean.

## NHS Patient Experience instruments

- NHS England. *Friends and Family Test (FFT).*
  <https://www.england.nhs.uk/fft/>
- Care Quality Commission. *National patient surveys (adult
  inpatient, outpatient, GP).*
  <https://www.cqc.org.uk/publications/surveys>
- NHS England. *Patient experience improvement framework.*
  <https://www.england.nhs.uk/patient-experience/>

The NHS instruments contribute the open-text *Comments &
Suggestions* design and the safeguarding-disclosure pathway.

## Likert scaling

- Likert R. *A technique for the measurement of attitudes.* Archives
  of Psychology 1932; 22(140): 1–55. (Foundational reference.)
- Carifio J, Perla RJ. *Resolving the 50-year debate around using and
  misusing Likert scales.* Med Educ 2008; 42(12): 1150–1152.
  PMID: 19120943.
  <https://onlinelibrary.wiley.com/doi/10.1111/j.1365-2923.2008.03172.x>

## Composite scoring formula

```
raw_mean    = mean(answered Likert items)        # 1.0 – 5.0
normalised  = (raw_mean - 1) / 4 * 100           # 0 – 100
```

This is the CAHPS-style linear normalization. Top-box reporting
(HCAHPS publication convention) is not implemented; sites needing
HCAHPS-compatible publication output should compute top-box
separately.

## Bands

| Composite | Label | Indicative HCAHPS / CG-CAHPS analogue |
| --- | --- | --- |
| 85 – 100 | Excellent | Top-box dominant |
| 70 – 84 | Good | Mixed top-box / second-box |
| 50 – 69 | Satisfactory | Mid-distribution |
| 25 – 49 | Poor | Skewed to lower bands |
| 0 – 24 | Very Poor | Bottom-box dominant |

The bands are an implementation convenience; HCAHPS itself does not
define such bands.
