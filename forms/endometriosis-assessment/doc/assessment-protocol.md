# Assessment protocol

## Intended use

A structured questionnaire that captures menstrual, pain, GI, urinary, and
fertility history; records prior treatments; calculates the EHP-30 domain
scores; and (when post-laparoscopy) accepts the surgeon's rASRM score. The
output supports MDT decision-making for women with confirmed or suspected
endometriosis.

## Intended users

- Primary care: GP or practice nurse running an endometriosis-aware clinic
- Secondary care: general gynaecology outpatient
- Tertiary care: BSGE-accredited endometriosis centre

## Setting

UK primary or secondary care clinic, patient or clinician device.

## Workflow

1. **Demographics** — name, DOB, GP, contact, ethnicity.
2. **Menstrual history** — menarche, cycle, bleeding pattern, dysmenorrhoea
   severity (NRS 0-10), duration trying for pregnancy.
3. **Pain assessment** — site, character, cyclicity, NRS pain score for
   dysmenorrhoea, dyspareunia, dyschezia, dysuria, chronic pelvic pain. NRS
   ≥7 or daily-life impact triggers an urgent-review flag.
4. **GI symptoms** — bowel pattern, cyclical rectal bleeding, tenesmus,
   bloating. Triggers consideration of deep infiltrating disease.
5. **Urinary symptoms** — frequency, urgency, cyclical haematuria, loin
   pain. Triggers consideration of ureteric or bladder involvement.
6. **Fertility assessment** — duration trying, prior conceptions, prior
   investigations, partner factors.
7. **Previous treatments** — analgesia, hormonal (CHC, POP, IUS,
   GnRH analogues), surgery.
8. **Surgical history** — previous laparoscopy, findings, rASRM score (if
   known).
9. **Quality of life** — EHP-30 30-item core questionnaire scored per
   published algorithm (0–100 per domain, 100 = worst HRQoL).
10. **Treatment planning** — patient preferences (analgesia, hormonal,
    surgery, fertility-preserving), shared decision-making notes.

## Output

The engine produces:

- EHP-30 domain scores (Pain, Control & Powerlessness, Emotional Well-being,
  Social Support, Self-image)
- A rASRM stage where surgical data has been entered
- A severity band (Mild/Moderate/Severe/Critical) combining the above
- A flagged-issues list (e.g. NRS ≥7, cyclical haematuria, bowel
  obstruction symptoms, infertility ≥12 months)
- A suggested referral pathway: GP managed, general gynae, BSGE centre

## Safety-net behaviour

- Suspected bowel or ureteric obstruction (severe constipation, vomiting,
  loin pain, oliguria) escalates to an emergency referral message.
- Heavy menstrual bleeding with haemodynamic compromise prompts urgent
  gynaecology referral.
- Fertility concerns combined with age ≥36 trigger an early fertility
  referral suggestion in line with NICE CG156.

## Out of scope

- Adenomyosis-specific scoring (no consensus instrument)
- Surgical operative planning
- IVF/ICSI dosing
- Adolescent endometriosis (use specialist paediatric/adolescent pathway)
