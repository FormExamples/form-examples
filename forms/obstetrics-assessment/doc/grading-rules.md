# Grading rules

The obstetrics-assessment form implements antenatal risk stratification
following NICE NG201 *Antenatal care* (published August 2021, last reviewed
2024 — verify current version on the NICE site).

NICE NG201 landing page: <https://www.nice.org.uk/guidance/ng201>

## Three-tier antenatal pathway

NICE NG201 §1.1 distinguishes between midwifery-led, obstetric-led, and
multidisciplinary care. The form maps the patient's risk factors onto this
framework producing three bands:

| Band | Definition |
| ---- | ---------- |
| Low risk | No obstetric, medical, or social risk factors identified — midwifery-led care recommended |
| Moderate risk | Modifiable factors or factors needing obstetric input at specific milestones — joint midwifery and obstetric care |
| High risk | Significant pre-existing or current pregnancy pathology — consultant-led, often multidisciplinary care |

These bands are presentational; NICE NG201 does not use "low / moderate /
high" terminology. The underlying risk factors are taken directly from
NG201 §1.1 and §1.4.

## Specific high-risk triggers (consultant-led care)

The engine triggers a "high-risk" recommendation when any of the following
is present. The list is drawn from NICE NG201 §1.1, NICE NG3 (diabetes in
pregnancy), NICE NG133 (hypertension in pregnancy), and the RCOG GTG 37a
(VTE in pregnancy).

- Previous caesarean section
- Pre-existing diabetes mellitus (Type 1 or Type 2) — refer to NICE NG3
- Pre-eclampsia in a previous pregnancy
- Pre-existing hypertension — NICE NG133
- Cardiac disease
- Renal disease
- Autoimmune disease (SLE, antiphospholipid syndrome)
- Known thrombophilia or prior VTE — RCOG GTG 37a
- Previous obstetric haemorrhage or placental complication
- Previous shoulder dystocia
- Previous fourth-degree perineal trauma
- Body mass index ≥ 40 kg/m² (booking)
- Previous stillbirth or neonatal death
- Recurrent miscarriage
- Multiple pregnancy — NICE NG137
- HIV / Hepatitis B / Hepatitis C
- Substance misuse
- Mental health: severe mental illness, previous postpartum psychosis

## Moderate-risk triggers (joint care)

- Body mass index 30–39.9 kg/m² at booking
- Age ≥ 40 at expected date of delivery
- Smoking at booking
- Pre-existing well-controlled asthma, thyroid disease
- Previous postpartum haemorrhage requiring transfusion
- Previous preterm birth 32–37 weeks
- IVF conception
- Vulnerable group (asylum seeker, homeless, age < 18, social services
  involvement)

## Booking visit milestones

NICE NG201 §1.2 sets the recommended schedule:

- Booking by 10 weeks (ideally before 10 + 0)
- Dating scan 11 + 0 to 14 + 1
- Combined test 11 + 0 to 14 + 1
- Anomaly scan 18 + 0 to 20 + 6
- Routine appointments per NG201 §1.5 schedule for nulliparous (10
  appointments) vs parous (7 appointments)

## Mental-health screening

The form uses the NG201-recommended Whooley two-question depression
screener and GAD-2 anxiety screener:

- Whooley R, Avins AL, Miranda J, Browner WS. *Case-finding instruments for
  depression: Two questions are as good as many.* Journal of General
  Internal Medicine. 1997;12(7):439–445. DOI:
  <https://doi.org/10.1046/j.1525-1497.1997.00076.x>
- Kroenke K, Spitzer RL, Williams JBW, Monahan PO, Löwe B. *Anxiety
  disorders in primary care: prevalence, impairment, comorbidity, and
  detection.* Annals of Internal Medicine. 2007;146(5):317–325. DOI:
  <https://doi.org/10.7326/0003-4819-146-5-200703060-00004>

## Domestic abuse and safeguarding

NICE NG201 §1.4 recommends routine enquiry about domestic abuse in
pregnancy. The form includes safeguarding signposting per:

- NICE NG76 — *Child abuse and neglect*: <https://www.nice.org.uk/guidance/ng76>
- Department of Health, *Responding to domestic abuse: a resource for
  health professionals* (2017, updated 2025 — verify current version).

## Output

The engine produces:

- Risk band (Low / Moderate / High)
- Care-pathway recommendation (midwife-led / shared / consultant-led)
- A flagged-issues list with the specific triggers identified
- Booking visit milestone tracker (which scans / tests scheduled / completed)
- A structured PDF for the maternity record
