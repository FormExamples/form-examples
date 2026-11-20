import type { Directive, FlaggedIssue } from './types';
import {
  agentFacilityConflict,
  agentProviderConflict,
  agentUnderAge,
  capacityDenied,
  executionDefects,
  hasAgent,
  hasSuccessor,
  isKnownState,
  missingRequired,
  nonEmpty,
  principalMinor,
  sameAgentAndSuccessor,
  stateRule
} from './rules';

// Flagged-issue detection (execution, eligibility, and completeness). Independent
// of the readiness class (which the grader produces), this module raises
// principal- and reviewer-facing flags per spec section 5. Every flag has a
// stable id (F-HCPOA-NNN), a category, a priority, a description, and a
// suggested action. Rows mirror the `united_states_health_care_power_of_attorney_grade_flag`
// SQL table. NOTHING here is legal advice; the flags support, and never replace,
// the principal's attorney, the witnesses, and the facility.

const DEFECT_FLAG: Record<string, [string, string, string]> = {
  'witnesses-not-present': [
    'F-HCPOA-004',
    'execution-formalities',
    'Re-sign in the presence of the witnesses or notary.'
  ],
  'witness-is-agent': [
    'F-HCPOA-003',
    'witness-eligibility',
    'Replace the witness with a disinterested adult; an agent should never witness the appointment.'
  ],
  'witness-barred': [
    'F-HCPOA-003',
    'witness-eligibility',
    'Replace the barred witness with an adult who is not a relative, heir, provider, or facility staff member.'
  ],
  'notary-not-accepted': [
    'F-HCPOA-004',
    'execution-formalities',
    'Use the witnessing method this state requires.'
  ],
  'notary-missing': [
    'F-HCPOA-004',
    'execution-formalities',
    'Name the notary and attach the acknowledgment certificate.'
  ],
  'witness-count': [
    'F-HCPOA-004',
    'execution-formalities',
    'Obtain the required number of qualified witnesses before signing.'
  ],
  'no-unrelated-witness': [
    'F-HCPOA-004',
    'execution-formalities',
    "Add a witness who is not related to the principal, not an heir, and not the principal's provider."
  ],
  'snf-ombudsman': [
    'F-HCPOA-005',
    'facility-rule',
    'Arrange for a patient advocate or ombudsman designated by the state to sign as a witness.'
  ]
};

function detectFlaggedIssues(d: Directive): FlaggedIssue[] {
  const flags: FlaggedIssue[] = [];
  const rule = stateRule(d);

  // ─── Capacity and voluntariness (HIGH) ──────────────────────
  if (capacityDenied(d)) {
    flags.push({
      id: 'F-HCPOA-001',
      category: 'capacity',
      priority: 'high',
      description:
        'The principal is recorded as lacking capacity, or as not signing voluntarily. A directive signed without capacity or under pressure can be set aside.',
      suggestedAction:
        'Do not sign. Obtain a clinician capacity assessment and make sure the principal acts freely; ask an attorney for guidance.'
    });
  }

  // ─── Principal under 18 (HIGH) ──────────────────────────────
  if (principalMinor(d)) {
    flags.push({
      id: 'F-HCPOA-006',
      category: 'capacity',
      priority: 'high',
      description:
        'The principal was under 18 on the signature date. Adult health care powers of attorney require an adult principal (or a legally emancipated minor).',
      suggestedAction:
        'Confirm the date of birth and the signature date, or seek state-specific advice for an emancipated minor.'
    });
  }

  // ─── Agent eligibility (HIGH) ───────────────────────────────
  if (agentUnderAge(d)) {
    flags.push({
      id: 'F-HCPOA-002',
      category: 'agent-eligibility',
      priority: 'high',
      description: `The named agent is ${d.agent.agentAge}, under 18. An agent must be an adult.`,
      suggestedAction: 'Name an adult agent.'
    });
  }
  if (agentProviderConflict(d)) {
    flags.push({
      id: 'F-HCPOA-002',
      category: 'agent-eligibility',
      priority: 'high',
      description: `The named agent is the principal's treating health care provider or its employee and is not related to the principal; ${rule.name} restricts this (${rule.cite}).`,
      suggestedAction:
        'Name a different agent, or confirm the exception for relatives and co-workers in the state statute.'
    });
  }
  if (agentFacilityConflict(d)) {
    flags.push({
      id: 'F-HCPOA-002',
      category: 'agent-eligibility',
      priority: 'high',
      description:
        'The named agent operates or works at the facility where the principal is a patient and is not related to the principal. Many states bar or limit this appointment.',
      suggestedAction:
        'Name an agent who is not affiliated with the facility, or confirm the state exception for relatives.'
    });
  }

  // ─── Execution defects (HIGH) ───────────────────────────────
  const seen = new Set();
  for (const defect of executionDefects(d)) {
    const [id, category, action] = DEFECT_FLAG[defect.code];
    const key = `${id}|${defect.text}`;
    if (seen.has(key)) continue;
    seen.add(key);
    flags.push({
      id,
      category,
      priority: 'high',
      description: defect.text,
      suggestedAction: action
    });
  }

  // ─── Missing required content (MEDIUM) ──────────────────────
  const missing = missingRequired(d);
  if (missing.length > 0) {
    flags.push({
      id: 'F-HCPOA-019',
      category: 'missing-required',
      priority: 'medium',
      description: `Required content is blank: ${missing.join(', ')}.`,
      suggestedAction: 'Complete every required field before the document is printed for signing.'
    });
  }

  // ─── Successor agent (MEDIUM) ───────────────────────────────
  if (hasAgent(d) && !hasSuccessor(d)) {
    flags.push({
      id: 'F-HCPOA-007',
      category: 'successor-agent',
      priority: 'medium',
      description:
        'No successor agent is named. If the agent is unwilling, unavailable, or incapacitated, no one may be able to act.',
      suggestedAction: 'Name at least one successor agent, in order of priority.'
    });
  }
  if (sameAgentAndSuccessor(d)) {
    flags.push({
      id: 'F-HCPOA-015',
      category: 'successor-agent',
      priority: 'low',
      description: 'A successor agent has the same name as the primary agent.',
      suggestedAction: 'Name a different person as successor.'
    });
  }
  if (hasAgent(d) && d.agent.agentAccepted === 'no') {
    flags.push({
      id: 'F-HCPOA-016',
      category: 'successor-agent',
      priority: 'medium',
      description: 'The agent has not been told about, or has not agreed to, the appointment.',
      suggestedAction:
        "Talk with the agent about the principal's wishes and confirm they are willing to serve."
    });
  }

  // ─── HIPAA release (MEDIUM) ─────────────────────────────────
  if (d.authority.hipaaRelease === 'no') {
    flags.push({
      id: 'F-HCPOA-008',
      category: 'hipaa',
      priority: 'medium',
      description:
        'No HIPAA authorization is included, so providers may refuse the agent access to protected health information before incapacity is certified.',
      suggestedAction:
        'Add a HIPAA release (45 CFR 164.508) so the agent can see records and talk to providers.'
    });
  }

  // ─── Treatment wishes (MEDIUM) ──────────────────────────────
  const w = d.wishes;
  if (
    w.lifeSustainingTreatment === 'refuse' &&
    (w.cpr === 'accept' || w.artificialNutrition === 'accept')
  ) {
    flags.push({
      id: 'F-HCPOA-009',
      category: 'treatment-wishes',
      priority: 'medium',
      description:
        'The general wish refuses life-sustaining treatment, but a specific wish (CPR or artificial nutrition) accepts it. Providers may not know which to follow.',
      suggestedAction: 'Reconcile the instructions so the general and specific wishes agree.'
    });
  }
  if (
    w.lifeSustainingTreatment === 'want-all' &&
    (w.cpr === 'refuse' || w.ventilator === 'refuse')
  ) {
    flags.push({
      id: 'F-HCPOA-009',
      category: 'treatment-wishes',
      priority: 'medium',
      description:
        'The general wish accepts all treatment, but a specific wish (CPR or ventilator) refuses it. Providers may not know which to follow.',
      suggestedAction: 'Reconcile the instructions so the general and specific wishes agree.'
    });
  }

  // ─── POLST distinction (MEDIUM) ─────────────────────────────
  if (w.seriousIllness === 'yes' && w.polstStatus === 'none') {
    flags.push({
      id: 'F-HCPOA-010',
      category: 'polst',
      priority: 'medium',
      description:
        'The principal has a serious illness or frailty but no POLST (Physician Orders for Life-Sustaining Treatment). A health care power of attorney is not a medical order; emergency staff follow only a POLST or similar order.',
      suggestedAction:
        'Ask the treating clinician about a POLST, and keep it consistent with this directive.'
    });
  }
  if (w.seriousIllness !== 'yes' && w.polstStatus === 'in-place') {
    flags.push({
      id: 'F-HCPOA-010',
      category: 'polst',
      priority: 'low',
      description:
        'A POLST is recorded although no serious illness or frailty is. A POLST is intended for people with serious illness or frailty.',
      suggestedAction:
        'Confirm with the clinician that the POLST is appropriate and matches the wishes in this directive.'
    });
  }

  // ─── Organ donation (LOW) ───────────────────────────────────
  if (d.authority.organDonation === '' || d.authority.organDonation === 'not-addressed') {
    flags.push({
      id: 'F-HCPOA-011',
      category: 'organ-donation',
      priority: 'low',
      description:
        'Organ and tissue donation is not addressed. Without direction, the agent or family decides at a stressful time.',
      suggestedAction:
        'State whether the principal wishes to donate, and register under the state donor registry if so.'
    });
  }

  // ─── State rule (MEDIUM) ────────────────────────────────────
  if (nonEmpty(d.principal.state) && !isKnownState(d)) {
    flags.push({
      id: 'F-HCPOA-012',
      category: 'state-rule',
      priority: 'medium',
      description: `State "${d.principal.state}" is not in this tool's verified rule table; the uniform default (two witnesses or a notary, at least one unrelated witness, no provider witnesses) was applied.`,
      suggestedAction:
        "Verify the state rule with the state statute, the state attorney general, or an attorney, and use the state's own form if it has one."
    });
  }

  // ─── Prior directive (MEDIUM) ───────────────────────────────
  if (d.authority.priorDirectiveStatus === 'prior-remains') {
    flags.push({
      id: 'F-HCPOA-014',
      category: 'revocation',
      priority: 'medium',
      description:
        'A prior directive remains in force alongside this one, so the two may conflict.',
      suggestedAction:
        'State in writing that this document revokes earlier health care powers of attorney, and notify holders of the old copies.'
    });
  }

  // ─── Distribution (LOW) ─────────────────────────────────────
  if (d.distribution.copyToAgent !== 'yes' || d.distribution.copyToPhysician !== 'yes') {
    flags.push({
      id: 'F-HCPOA-013',
      category: 'distribution',
      priority: 'low',
      description:
        "The signed directive has not been given to the agent and the principal's physician. A directive nobody can find does not help the principal.",
      suggestedAction:
        'Give copies to the agent, any successor agents, and the physician; bring a copy to every hospital admission (federal Patient Self-Determination Act, 42 U.S.C. 1395cc(f)).'
    });
  }

  return flags;
}

export { detectFlaggedIssues };
