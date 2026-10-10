// Flagged issues for the DTAC grader. Each flag: { flagId, category, severity, message }.
// Called as detectFlags(state, grade). Flag IDs are stable across all implementations.

function detectFlags(data, grade) {
  const c = data.criteria;
  const flags = [];
  const add = (flagId, category, severity, message) => flags.push({ flagId, category, severity, message });

  if (c.c1 === 'not-met' || c.c5 === 'not-met') {
    add('F-CSO-001', 'clinical-safety', 'critical', 'No named, registered Clinical Safety Officer.');
  }
  if (c.c2 === 'not-met' || c.c3 === 'not-met' || c.c4 === 'not-met') {
    add('F-DCB0129-001', 'clinical-safety', 'critical', 'DCB0129 clinical risk management documentation (plan, hazard log or safety case) is missing.');
  }
  if (c.c6 === 'not-met' && data.product.medicalDeviceClass !== 'not-a-medical-device') {
    add('F-MEDDEV-001', 'clinical-safety', 'critical', 'Medical device without correct classification or registration.');
  }
  if (c.d2 === 'not-met') {
    add('F-DPIA-001', 'data-protection', 'critical', 'No Data Protection Impact Assessment.');
  }
  if (c.d3 === 'not-met') {
    add('F-DSPT-001', 'data-protection', 'warning', 'Data Security and Protection Toolkit standards not met.');
  }
  if (c.d6 === 'not-met') {
    add('F-TRANSFER-001', 'data-protection', 'warning', 'Data location or international transfer safeguards not demonstrated.');
  }
  if (c.e1 === 'not-met') {
    add('F-CERT-001', 'technical-security', 'warning', 'No Cyber Essentials Plus or ISO 27001 certification.');
  }
  if (c.e2 === 'not-met') {
    add('F-PENTEST-001', 'technical-security', 'critical', 'No penetration test within the last 12 months.');
  }
  if (c.e5 === 'not-met') {
    add('F-MFA-001', 'technical-security', 'critical', 'Access control with multi-factor authentication not in place.');
  }
  if (c.f3 === 'not-met' && data.product.handlesPatientData === 'yes') {
    add('F-NHSNUMBER-001', 'interoperability', 'warning', 'Product holds patient data but does not support the NHS Number.');
  }
  if (c.g2 === 'not-met') {
    add('F-WCAG-001', 'accessibility', 'critical', 'No WCAG AA conformance.');
  }
  if (c.g3 === 'not-met') {
    add('F-A11Y-STATEMENT-001', 'accessibility', 'warning', 'No published accessibility statement.');
  }
  if (c.a1 === 'not-met' || c.a2 === 'not-met') {
    add('F-COMPANY-001', 'company', 'warning', 'Supplier registration or ICO registration not demonstrated.');
  }
  if (grade.outcome === 'incomplete') {
    add('F-INCOMPLETE-001', 'completeness', 'info', 'One or more applicable mandatory criteria are unanswered.');
  }
  if (grade.outcome === 'meets' && data.assessment.reviewDueDate === null) {
    add('F-REVIEW-001', 'completeness', 'info', 'No review due date set for a passing assessment.');
  }
  return flags;
}

export { detectFlags };
