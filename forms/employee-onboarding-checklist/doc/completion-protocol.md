# Completion protocol — onboarding checklist

## Roles

| Role | Responsibility |
| --- | --- |
| Hiring manager | Owns the checklist; signs off completion at end of probation |
| HR / People Operations | Ensures statutory items are completed before day 1 |
| IT / facilities | Provisioning of accounts, devices, building access |
| Buddy / mentor | Informal socialisation; first-week shadowing |
| New hire | Self-attestation of receipt of policies, contract, and training |

## Sections

The checklist is grouped by time horizon (see methodology-reference.md):

1. **Pre-employment**
   - Offer letter signed.
   - Contract of employment issued and returned.
   - Right to work check completed and evidence retained.
   - Background checks (DBS where relevant) completed.
   - Welcome pack sent.

2. **Day 1**
   - Written statement of particulars handed over.
   - HR / payroll new-starter forms (P45 / starter declaration).
   - Workplace pension auto-enrolment notice.
   - IT account and device provisioning.
   - Building access.
   - Initial Health & Safety induction (fire, first aid, DSE).
   - Introduction to immediate team and buddy.

3. **First week**
   - Tour of premises (or virtual equivalent).
   - 1:1 with hiring manager.
   - Statutory training: data protection, anti-bribery, equality &
     dignity-at-work.
   - Role-specific training kick-off.

4. **First month**
   - 30-day check-in.
   - Objectives and key results (OKRs) for probation set.
   - Documented socialisation: cross-team introductions; access to
     team rituals (stand-ups, retros).
   - Confirmation of working pattern, location, and any reasonable
     adjustments.

5. **End of probation**
   - 60-/90-day check-ins.
   - Performance review against probationary objectives.
   - Confirmation of employment or extension/exit decision.
   - Lessons-learned feedback collected for next hire.

## Statutory items (must-have)

The following items are statutory and the checklist **blocks
completion** if any is missing:

- **Right to work check** with evidence of accepted documents (list A
  or list B) — Immigration, Asylum and Nationality Act 2006.
- **Written statement of particulars** on or before day 1 —
  Employment Rights Act 1996 s.1.
- **Pension auto-enrolment notice** within the first 6 weeks —
  Pensions Act 2008.
- **Health & Safety induction record** — Management of Health and
  Safety at Work Regulations 1999, reg. 10.
- **Data protection acknowledgement** — UK GDPR + DPA 2018.

## Data captured per checklist item

Each item has: title, owner role, due-by-horizon, status (pending /
in-progress / done / skipped-with-reason), evidence pointer, timestamp,
attesting user.

The implementation does **not** store copies of passports, share codes,
or other documentary evidence beyond a metadata pointer; storage and
retention of identity documents follow the Home Office Right to Work
guidance.

## Sign-off

Completion requires:

1. All statutory items marked done with evidence.
2. Hiring manager attestation that the new hire is integrated.
3. New-hire attestation that policies and contracts have been received.
4. HR attestation that statutory training is complete.

The audit trail is append-only; deletions are soft and require
managerial approval.
