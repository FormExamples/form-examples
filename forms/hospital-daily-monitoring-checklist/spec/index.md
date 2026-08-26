# Hospital Daily Monitoring Checklist — Spec

Living spec for `hospital-daily-monitoring-checklist`. This is the
canonical, hand-maintained source of the 97 checkpoints. Front-end
item catalogues (`front-end-with-svelte/src/lib/config/items.ts`,
`front-end-with-html/js/items.js`) and the SQL seed data must stay
in sync with this list.

## Response model

Each checkpoint below is answered independently as `satisfactory`,
`needs-attention`, `not-applicable`, or left unanswered (`''`), with
an optional free-text remark.

## Checkpoint catalogue

### 1. OPD

- `1.1` — Reception & Help Desk — patient guidance, information regarding services & doctor.
- `1.2` — Registration — availability as per mode of staff, stationary, prescription slips, HMIS (hospital statistics).
- `1.3` — Senior Citizen Counter display.
- `1.4` — Complaint Box.
- `1.5` — Chambers of Doctors & Specialist, patient's sitting arrangement, patient disposal.
- `1.6` — Dispensary — availability of drugs, pharmacist, duty roster.
- `1.7` — Grievance redressal by RMO / Superintendent.
- `1.8` — Minor O.T. — dressing material, instruments, sterilized drums, gloves etc.
- `1.9` — Plaster room, injection room — availability of material & performance status.
- `1.10` — Referral register.
- `1.11` — Enquire whether patients are getting medicine or not.

### 2. Causality

- `2.1` — Availability of doctor, nurse, compounder, other support staff duty roster. CMO daily report.
- `2.2` — Availability of emergency tray having drugs, oxygen, ambu-bag, suction, equipment functioning, support staff, duty roster.
- `2.3` — Status of emergency ward.
- `2.4` — Skill of medical / paramedical in life-saving practices, emergency ward, emergency box having drugs, stitching material, dressing material for disaster.

### 3. Dispensary

- `3.1` — Availability of sufficient drug stock.
- `3.2` — Stock book entry, daily expenditure entry verification.
- `3.3` — Drug dispensing in envelopes.

### 4. H.R. status check attendance

- `4.1` — Medical, para medical.
- `4.2` — Support staff, behaviour of staff among colleagues and with patient.

### 5. Ambulance

- `5.1` — 24x7 availability & functioning, diesel, petrol.
- `5.2` — Driver — available round the clock.
- `5.3` — Daily log book verification.

### 6. Diagnostic Facility

**6.1 Pathology Lab**

- `6.1.1` — Staff.
- `6.1.2` — Equipments & their functioning status.
- `6.1.3` — Consumables.
- `6.1.4` — Whether range of investigation is consistent with the medical services provided.
- `6.1.5` — Reports — whether being released in time to O.P.D. / wards.

**6.2 Radio Imaging**

- `6.2.1` — X-ray / CT scan machine & functioning status.
- `6.2.2` — Availability and quality of fixer developer, X-ray film.
- `6.2.3` — USG — functioning status.
- `6.2.4` — Radiation Safety Officer nominated.
- `6.2.5` — Reports — whether being released in time to OPD / ward.
- `6.2.6` — Status of Radiation Protection Protocol, badges being regularly used.

### 7. Store

- `7.1` — Store keeper / pharmacist — availability.
- `7.2` — Storage of drugs in order, cleanliness.
- `7.3` — Security status.
- `7.4` — Drugs — sample stock check, expiry (FEFO).

### 8. O.T. / ICU

- `8.1` — Anaesthetist — specialist / M.O.
- `8.2` — Support staff.
- `8.3` — Functioning status of equipment.
- `8.4` — Duty roster, OT checklist, infection control measures — fumigation / culture.
- `8.5` — Emergency / OT drugs / sterilization of linen / instrument.

### 9. Labour Room

- `9.1` — Availability of staff, drugs, five trays.
- `9.2` — Availability & status of resuscitation equipment.
- `9.3` — Status of labour table, mattress, macintosh.
- `9.4` — Cleanliness status, availability of dustbins, water supply etc.

### 10. Wards

- `10.1` — Status of mattress, sheets, drugs.
- `10.2` — Staff — regular rounds by medical officer / specialist to be ensured.
- `10.3` — Record keeping — drugs, case sheet etc.
- `10.4` — Nursing & support staff.
- `10.5` — Enquire patients regarding services, behaviour of the staff.

### 11. House Keeping

- `11.1` — OPD.
- `11.2` — Wards.
- `11.3` — OT / ICU.
- `11.4` — L.R.
- `11.5` — Premises.
- `11.6` — Drainages.
- `11.7` — Toilets cleanliness, lights.
- `11.8` — Toilets for OPD patients, use of disinfectants.

### 12. Water Supply

- `12.1` — Drinking water RO / aqua guard.
- `12.2` — Water cooler — maintenance.
- `12.3` — Overhead tanks.
- `12.4` — Taps & fittings, leakages.
- `12.5` — Washroom.
- `12.6` — Washbasins.

### 13. Electric Supply

- `13.1` — General — switches, wiring, lights.
- `13.2` — Generator functional status.
- `13.3` — Availability of electrician during routine / emergency hours.

### 14. Diet

- `14.1` — Availability of staff.
- `14.2` — Availability of food items & timings of food supply.
- `14.3` — Utensils — availability & cleanliness.
- `14.4` — Food trolley.
- `14.5` — Water supply.
- `14.6` — General cleanliness.

### 15. Hospital Signage

- `15` — Hospital signage, display boards, timings display.

### 16. Fire Fighting Equipment

- `16` — Fire fighting equipment.

### 17. Patient Feedback

- `17` — Patient's / attendant's feedback.

### 18. Mortuary

- `18` — Care of dead / mortuary arrangements / post-mortem.

### 19. Hospital Furniture

- `19` — Hospital furniture.

### 20. Hospital Waste Management

- `20.1` — Collection.
- `20.2` — Segregation.
- `20.3` — Maintenance of record.
- `20.4` — Transportation.
- `20.5` — Disposal if in-house, whether protocol is followed.
- `20.6` — Destruction & disposal of sharps.
- `20.7` — Destruction & disinfection of rubber, glass & plastics.
- `20.8` — Colour-coded bins are in place in OPD, in wards.
- `20.9` — Regular changing of polythenes.
- `20.10` — Use of protective gear, boots, apron etc by staff.

### 21. Observance & Practice of Infection Control Protocols

- `21.1` — In O.T.
- `21.2` — In ICU.
- `21.3` — In L.R.
- `21.4` — Hand wash practice.
- `21.5` — Protective gloves, apron etc.

### 22. Record Room

- `22.1` — Cleanliness / pests / rodents.
- `22.2` — Proper filing, stocking.

## Source

Transcribed from a hospital administration daily-monitoring rounds
proforma (Resident Medical Officer / Medical Superintendent daily
checklist format). Item text is preserved as closely as possible to
the source, with obvious OCR-style abbreviations expanded for
readability (e.g. "O.T." kept, ampersands kept, minor punctuation
normalized).
