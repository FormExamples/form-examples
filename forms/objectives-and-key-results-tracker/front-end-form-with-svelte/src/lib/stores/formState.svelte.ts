import type { ObjectiveAssessment, RawScores, KeyResult } from '$engine/types';

const blankScores: RawScores = {
  progressPercent: null,
  confidenceDecile: null,
  stretchTier: null,
  alignmentGrade: null,
  impactTier: null,
  smartQuality: null,
  paceDeviationPercent: null,
};

function blankKR(position: number): KeyResult {
  return {
    position,
    title: '',
    krType: '',
    startValue: null,
    currentValue: null,
    targetValue: null,
    milestonesJson: null,
    binaryDone: null,
    progressFraction: null,
  } as any;
}

class FormState {
  reporter = $state({ name: '', email: '', role: '' });
  cycle = $state({
    level: '' as 'individual' | 'team' | 'department' | 'company' | '',
    cycle: '' as 'monthly' | 'quarterly' | 'half-yearly' | 'annual' | 'custom' | '',
    cycleStartDate: '',
    cycleEndDate: '',
  });
  objective = $state({
    obj_title: '',
    obj_long_description: '',
    strategic_theme: '',
    parent_objective_id: '',
  });
  participants = $state({ dri: '', contributors: '', reviewers: '', stakeholders: '' });
  alignment = $state({ sa_parent_summary: '', sa_business_value_statement: '' });
  keyResults = $state<KeyResult[]>([blankKR(1)]);
  initiatives = $state({ in_initiatives: '', in_supporting_links: '' });
  risks = $state({
    rk_known_risks: '',
    rk_dependencies: '',
    rk_blockers: '',
    rk_mitigation_plans: '',
  });
  checkIn = $state({ narrative: '', since_last_changes: '', blockers: '', asks: '' });
  forecast = $state({ fc_expected_end_state: '', fc_residual_risk: '' });
  scores = $state<RawScores>({ ...blankScores });
  signature = $state({ signed_by: '', override_reason: '', recommendation: '' });

  addKr() {
    if (this.keyResults.length < 5) this.keyResults.push(blankKR(this.keyResults.length + 1));
  }
  removeKr(i: number) {
    this.keyResults.splice(i, 1);
    this.keyResults.forEach((k, idx) => (k.position = idx + 1));
  }

  buildAssessment(): ObjectiveAssessment {
    return {
      scores: this.scores,
      keyResults: this.keyResults,
      context: {
        level: this.cycle.level,
        parentObjectiveId: this.objective.parent_objective_id || null,
        parentObjectiveStatus: null,
        driPresent: !!this.participants.dri,
        cycleStartDate: this.cycle.cycleStartDate || null,
        cycleEndDate: this.cycle.cycleEndDate || null,
        checkedInAt: this.checkIn.narrative ? new Date().toISOString() : null,
        previousConfidenceDecile: null,
      },
      now: new Date().toISOString(),
    };
  }
}

export const formState = new FormState();
