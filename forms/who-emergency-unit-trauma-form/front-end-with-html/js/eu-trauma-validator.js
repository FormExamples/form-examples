import { euTraumaRules } from './eu-trauma-rules.js';

// WHO Emergency Unit Form: Trauma — completeness validator. Pure
// function: takes an `AssessmentData` object, returns a
// `ValidationResult` with per-section breakdown and the list of fired
// (unsatisfied) rules. Each rule is first checked against `applies()`
// so conditional sections (time of death only when dead-on-arrival,
// spine stabilization / GCS only for RED triage, admit ward, transfer
// destination, cause of death) do not produce false missing-field
// reports.

function validateEuTrauma(data) {
  const sectionMap = new Map();
  const missing = [];
  let totalRequired = 0;
  let totalSatisfied = 0;

  for (const rule of euTraumaRules) {
    let applies = false;
    try {
      applies = rule.applies(data);
    } catch (e) {
      console.warn(`EU Trauma rule ${rule.id} applies() failed:`, e);
    }
    if (!applies) continue;

    totalRequired++;

    let satisfied = false;
    try {
      satisfied = rule.isSatisfied(data);
    } catch (e) {
      console.warn(`EU Trauma rule ${rule.id} isSatisfied() failed:`, e);
    }

    let bucket = sectionMap.get(rule.section);
    if (!bucket) {
      bucket = {
        section: rule.section,
        required: 0,
        satisfied: 0,
        missing: []
      };
      sectionMap.set(rule.section, bucket);
    }
    bucket.required++;

    if (satisfied) {
      totalSatisfied++;
      bucket.satisfied++;
    } else {
      const fired = {
        id: rule.id,
        section: rule.section,
        description: rule.description
      };
      missing.push(fired);
      bucket.missing.push(fired);
    }
  }

  const sections = Array.from(sectionMap.values());

  return {
    complete: missing.length === 0,
    totalRequired,
    totalSatisfied,
    sections,
    missing
  };
}

export { validateEuTrauma };
