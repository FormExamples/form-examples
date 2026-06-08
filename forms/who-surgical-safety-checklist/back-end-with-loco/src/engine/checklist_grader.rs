//! Checklist grader module.

use super::checklist_rules::all_rules;
use super::flagged_issues::detect_additional_flags;
use super::types::{
    AdditionalFlag, AssessmentData, ChecklistStatus, FiredRule, GradingResult, PhaseProgress,
};
use super::utils::{
    case_abandoned, sign_in_signed_off, sign_out_signed_off, time_out_signed_off,
};

/// Total per-phase item counts used for the completion percentage. These
/// reflect the **required** WHO checklist items (the yes / no enums and
/// the required free-text fields). Optional free-text annotation fields
/// such as `equipment_problems` or `recovery_concerns` are not counted —
/// they are notes, not required confirmations.
const SIGN_IN_TOTAL: u32 = 7;
const TIME_OUT_TOTAL: u32 = 5; // 1, 2, 3, 8, 10 are the WHO required confirmations
const SIGN_OUT_TOTAL: u32 = 3; // 1, 2, 3 are the WHO nurse verbal confirmations

/// Pure function: grades a WHO Surgical Safety Checklist case.
///
/// Returns a [`GradingResult`] containing:
/// - overall checklist status (`not-started` → `complete-with-concerns`)
/// - per-phase progress (answered / total / signed-off)
/// - fired rules (one per unanswered checklist item)
/// - additional flags (real-time WHO safety alerts)
pub fn grade(data: &AssessmentData) -> GradingResult {
    let timestamp = chrono::Utc::now().to_rfc3339();
    let fired_rules = run_rules(data);
    let additional_flags = detect_additional_flags(data);

    let sign_in_progress = phase_progress(
        "Sign In",
        data,
        SIGN_IN_TOTAL,
        sign_in_answered(data),
        sign_in_signed_off(data),
    );
    let time_out_progress = phase_progress(
        "Time Out",
        data,
        TIME_OUT_TOTAL,
        time_out_answered(data),
        time_out_signed_off(data),
    );
    let sign_out_progress = phase_progress(
        "Sign Out",
        data,
        SIGN_OUT_TOTAL,
        sign_out_answered(data),
        sign_out_signed_off(data),
    );

    let total_items = SIGN_IN_TOTAL + TIME_OUT_TOTAL + SIGN_OUT_TOTAL;
    let total_answered =
        sign_in_progress.answered + time_out_progress.answered + sign_out_progress.answered;
    let overall_percent = percent(total_answered, total_items);

    let checklist_status = derive_status(
        data,
        &sign_in_progress,
        &time_out_progress,
        &sign_out_progress,
        &additional_flags,
    );

    GradingResult {
        checklist_status,
        sign_in_progress,
        time_out_progress,
        sign_out_progress,
        overall_percent,
        fired_rules,
        additional_flags,
        timestamp,
    }
}

/// Evaluate every rule against the data, returning the rules that fired.
pub fn run_rules(data: &AssessmentData) -> Vec<FiredRule> {
    let mut out = Vec::new();
    for rule in all_rules() {
        if (rule.evaluate)(data) {
            out.push(FiredRule {
                id: rule.id.to_string(),
                phase: rule.phase.to_string(),
                category: rule.category.to_string(),
                description: rule.description.to_string(),
                severity: rule.severity.to_string(),
            });
        }
    }
    out
}

fn phase_progress(
    phase: &str,
    _data: &AssessmentData,
    total: u32,
    answered: u32,
    signed_off: bool,
) -> PhaseProgress {
    let percent = percent(answered, total);
    PhaseProgress {
        phase: phase.to_string(),
        answered,
        total,
        percent,
        signed_off,
    }
}

/// Count answered items in Phase 1 — Sign In. An item is "answered" when
/// its value is not the empty string `''`. (For the allergy-detail
/// follow-up, the detail is only required when allergy=yes; it does not
/// contribute its own item slot.)
fn sign_in_answered(d: &AssessmentData) -> u32 {
    let mut n = 0;
    if !d.sign_in.identity_site_procedure_consent.is_empty() {
        n += 1;
    }
    if !d.sign_in.site_marked.is_empty() {
        n += 1;
    }
    if !d.sign_in.anaesthesia_check_complete.is_empty() {
        n += 1;
    }
    if !d.sign_in.pulse_oximeter_on_patient.is_empty() {
        n += 1;
    }
    if !d.sign_in.known_allergy.is_empty()
        && (d.sign_in.known_allergy != "yes"
            || !d.sign_in.known_allergy_detail.trim().is_empty())
    {
        n += 1;
    }
    if !d.sign_in.difficult_airway_aspiration_risk.is_empty() {
        n += 1;
    }
    if !d.sign_in.blood_loss_risk.is_empty() {
        n += 1;
    }
    n
}

/// Count answered required items in Phase 2 — Time Out. Surgeon /
/// anaesthetist annotation fields (critical steps, blood-loss number,
/// patient concerns, equipment concerns) are optional notes and do not
/// contribute to completion percentage.
fn time_out_answered(d: &AssessmentData) -> u32 {
    let mut n = 0;
    if !d.time_out.team_introductions_confirmed.is_empty() {
        n += 1;
    }
    if !d.time_out.patient_procedure_incision_confirmed.is_empty() {
        n += 1;
    }
    if !d.time_out.antibiotic_prophylaxis_within_60min.is_empty() {
        n += 1;
    }
    if !d.time_out.nursing_sterility_confirmed.is_empty() {
        n += 1;
    }
    if !d.time_out.essential_imaging_displayed.is_empty() {
        n += 1;
    }
    n
}

/// Count answered required items in Phase 3 — Sign Out. The nurse
/// verbally confirms three items (procedure name, counts, specimens);
/// equipment-problems and recovery-concerns are optional notes.
fn sign_out_answered(d: &AssessmentData) -> u32 {
    let mut n = 0;
    if !d.sign_out.procedure_name_confirmed.is_empty() {
        n += 1;
    }
    if !d.sign_out.counts_confirmed.is_empty() {
        n += 1;
    }
    if !d.sign_out.specimens_labelled.is_empty() {
        n += 1;
    }
    n
}

fn percent(answered: u32, total: u32) -> u32 {
    if total == 0 {
        return 0;
    }
    ((answered as f64 / total as f64) * 100.0).round() as u32
}

fn derive_status(
    data: &AssessmentData,
    sign_in: &PhaseProgress,
    time_out: &PhaseProgress,
    sign_out: &PhaseProgress,
    flags: &[AdditionalFlag],
) -> ChecklistStatus {
    if case_abandoned(data) && !sign_out.signed_off {
        return "abandoned".to_string();
    }

    let sign_in_done = sign_in.answered == sign_in.total && sign_in.signed_off;
    let time_out_done = time_out.answered == time_out.total && time_out.signed_off;
    let sign_out_done = sign_out.answered == sign_out.total && sign_out.signed_off;

    if sign_in_done && time_out_done && sign_out_done {
        let any_high = flags.iter().any(|f| f.priority == "high");
        if any_high {
            "complete-with-concerns".to_string()
        } else {
            "complete".to_string()
        }
    } else if sign_in_done && time_out_done {
        "time-out-complete".to_string()
    } else if sign_in_done {
        "sign-in-complete".to_string()
    } else if sign_in.answered == 0 && time_out.answered == 0 && sign_out.answered == 0 {
        "not-started".to_string()
    } else {
        "in-progress".to_string()
    }
}
