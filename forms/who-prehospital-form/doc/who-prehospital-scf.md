# WHO Prehospital Standardised Clinical Form

This form implements the WHO standard prehospital patient-encounter
form for emergency medical services (EMS) operating in low-, middle-,
and high-resource settings. It is the prehospital companion to the WHO
Emergency Unit forms.

## Authoritative WHO sources

- **Form PDF** — WHO. *Prehospital Standardised Clinical Form*.
  <https://cdn.who.int/media/docs/default-source/integrated-health-services-(ihs)/csy/prehospital-scf.pdf>
- **Emergency Care Toolkit** —
  <https://www.who.int/teams/integrated-health-services/clinical-services-and-systems/emergency-and-critical-care>
- WHO. *Basic Emergency Care (BEC) — approach to the acutely ill and
  injured.* Geneva: WHO; 2018. ISBN 978-92-4-151308-1.
  <https://www.who.int/publications/i/item/basic-emergency-care-approach-to-the-acutely-ill-and-injured>
- WHO. *Prehospital trauma care systems*. Geneva: WHO; 2005. ISBN
  92-4-159294-X.
  <https://www.who.int/publications/i/item/9241592940>
- WHO. *Strengthening care for the injured: success stories and lessons
  learned from around the world*. Geneva: WHO; 2010. ISBN
  978-92-4-156341-3.
  <https://www.who.int/publications/i/item/9789241563413>

## Role in the WHO Emergency Care Toolkit

The Prehospital SCF is the WHO recommended single-page documentation
form for an EMS encounter. It is designed to be:

- **Mass-casualty-ready** — the "Mass Casualty" checkbox at the head of
  the form allows the same instrument to be used in mass-casualty
  incidents alongside a triage tag.
- **Inter-operable** — the field set is harmonised with the WHO
  Emergency Unit General and Trauma forms so the receiving facility can
  transcribe directly without re-collection.
- **Reference-card driven** — used with the same WHO reference card
  set, ensuring algorithmic consistency between EMS and the EU.

## Step → workflow mapping

| Form step | EMS workflow stage |
| --- | --- |
| 1. Caller & Scene | Dispatch and arrival on scene |
| 2. Chief Complaint & Vitals | First contact with patient |
| 3. High Risk Signs | Rapid triage |
| 4. Triage | Tag colour (RED / YELLOW / GREEN) |
| 5-9. Primary Survey ABCDE | Systematic patient assessment |
| 10. SAMPLE History | History from patient or bystanders |
| 11. Injury Details | If trauma — intent, mechanism, safety equipment |
| 12. Physical Exam | Focused or detailed exam |
| 13. Additional Interventions | All medications and procedures with times |
| 14. Assessment & Plan | Working differential, presumptive diagnoses |
| 15. Reassessment | Up to three sets of repeat vitals |
| 16. Disposition | Handover at facility, final vitals, signature |

## Timestamp set

Six timestamps are captured in Step 1; these are the WHO recommended EMS
service-quality indicators:

- **Call Received** — when dispatch receives the call.
- **En route to Scene** — when the unit leaves base.
- **Arrived at Scene** — when the unit reaches the patient.
- **Transporting** — when the unit departs the scene with the patient.
- **At Facility** — when the unit arrives at the receiving facility.
- **In Service** — when the unit is back on availability.

These mirror the timestamp set used in the US NEMSIS (National Emergency
Medical Services Information System) data dictionary, allowing
international comparability.

Reference: NEMSIS Technical Assistance Center. *NEMSIS data dictionary
v3.5.0*.
<https://nemsis.org/technical-resources/version-3/version-3-data-dictionaries/>

## SAMPLE history (Step 10)

The form uses the SAMPLE mnemonic standard across EMS curricula:

- **S**igns and symptoms
- **A**llergies
- **M**edications
- **P**ast medical and surgical history
- **L**ast oral intake
- **E**vents preceding the illness or injury

## Injury detail capture (Step 11)

For trauma calls the form captures the *intent* of the injury, which
the WHO injury surveillance framework requires for public-health
reporting:

- Accidental
- Self-inflicted
- Assault
- Intent unknown

Plus mechanism (blunt, penetrating, blast, burn, drowning, fall, road
traffic, animal bite, other), road-traffic role (driver, passenger,
pedestrian, cyclist, motorcyclist), and safety-equipment use (seat belt,
helmet, child restraint).

Reference: Holder Y, Peden M, Krug E, Lund J, Gururaj G, Kobusingye O
(eds). *Injury surveillance guidelines*. Geneva: WHO and CDC; 2001.

## Reassessment cadence

The form supports up to three reassessment sets. WHO BEC reassessment
intervals:

- Unstable patient: every 5 minutes.
- Stable patient: every 15 minutes.
- After any intervention: within 1 minute.

## Disposition and handover

The receiving-facility handover follows the **MIST** mnemonic used by
JRCALC and most international EMS handover guidelines:

- **M**echanism (or medical complaint)
- **I**njuries (or interventions and exam findings)
- **S**igns (vital signs and trends)
- **T**reatment given and response

Reference: JRCALC / AACE. *UK Ambulance Services Clinical Practice
Guidelines.* <https://aace.org.uk/clinical-practice-guidelines/>

## Vital signs captured

- HR — heart rate (per minute)
- RR — respiratory rate (per minute)
- BP — blood pressure (mmHg)
- Temp — temperature (°C)
- RBS — random blood sugar (mmol/L)
- SpO2 — peripheral oxygen saturation (%)
- Pain (0-10 numeric or Wong-Baker FACES for children)
- GCS or AVPU

## Versioning note

The WHO Prehospital SCF was published with the Emergency Care Toolkit
in 2019; revisions are tracked via the WHO CDN PDF query strings.

## References

- WHO. *Prehospital Standardised Clinical Form* (PDF) — see header.
- WHO. *Basic Emergency Care*. 2018.
- WHO. *Prehospital trauma care systems*. 2005. ISBN 92-4-159294-X.
- WHO. *Strengthening care for the injured*. 2010. ISBN
  978-92-4-156341-3.
- Holder Y, et al. *Injury surveillance guidelines*. WHO/CDC; 2001.
- NEMSIS Technical Assistance Center. *NEMSIS data dictionary v3.5.0*.
  <https://nemsis.org/technical-resources/version-3/version-3-data-dictionaries/>
- JRCALC / AACE. *UK Ambulance Services Clinical Practice Guidelines*.
  <https://aace.org.uk/clinical-practice-guidelines/>
