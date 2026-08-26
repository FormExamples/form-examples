//! Documentation-completeness engine, and the `grade()` entry point that runs
//! both engines.
//!
//! A component is "documented" when its field(s) hold a meaningful entry OR an
//! explicit negative flag is set — a deliberate negative is a valid clinical
//! record. The required set VARIES BY NOTE TYPE (spec §4.2), so it is resolved
//! per note rather than fixed.
//!
//! Classification (spec §4.3), where R is the required set and D the documented
//! members of R:
//!
//! - `|D| == |R|` → `Complete`
//! - header, impression, plan all present and `|D| >= ceil(|R| / 2)` → `Partial`
//! - otherwise → `Incomplete`
//!
//! The status is never overridable: it is a mechanical property of the record.

use super::acuity::evaluate_acuity;
use super::flagged_issues::detect_flagged_issues;
use super::news2::has_full_observation_set;
use super::types::{
    ComponentKey, ComponentStatus, CompletenessStatus, FiredRule, InpatientClinicalNote, NoteGrade,
    NoteType,
};

/// The twelve components, in order, with their BASE required class.
const COMPONENTS: [(ComponentKey, bool); 12] = [
    (ComponentKey::Header, true),
    (ComponentKey::IntervalHistory, true),
    (ComponentKey::Observations, true),
    (ComponentKey::Examination, false),
    (ComponentKey::Investigations, false),
    (ComponentKey::Problems, true),
    (ComponentKey::Medications, true),
    (ComponentKey::RiskAssessments, true),
    (ComponentKey::Impression, true),
    (ComponentKey::Plan, true),
    (ComponentKey::Escalation, true),
    (ComponentKey::Communication, false),
];

/// The three components whose absence forces an `Incomplete` grade.
const CRITICAL: [ComponentKey; 3] = [
    ComponentKey::Header,
    ComponentKey::Impression,
    ComponentKey::Plan,
];

/// Components a note type requires ON TOP of the base required set (spec §4.2).
#[must_use]
pub fn extra_required(note_type: Option<NoteType>) -> &'static [ComponentKey] {
    match note_type {
        Some(NoteType::AdmissionClerking) => {
            &[ComponentKey::Examination, ComponentKey::Investigations]
        }
        Some(NoteType::Consult | NoteType::Procedure) => {
            &[ComponentKey::Examination, ComponentKey::Communication]
        }
        Some(NoteType::Transfer | NoteType::DischargePlanning) => &[ComponentKey::Communication],
        _ => &[],
    }
}

/// Whether a component is required for this note's type.
#[must_use]
pub fn is_required(component: ComponentKey, note_type: Option<NoteType>) -> bool {
    COMPONENTS
        .iter()
        .any(|(k, base)| *k == component && *base)
        || extra_required(note_type).contains(&component)
}

/// Stable rule id per component.
const fn rule_id(component: ComponentKey) -> &'static str {
    match component {
        ComponentKey::Header => "R-HEADER-DOCUMENTED-01",
        ComponentKey::IntervalHistory => "R-INTERVAL-DOCUMENTED-01",
        ComponentKey::Observations => "R-OBSERVATIONS-DOCUMENTED-01",
        ComponentKey::Examination => "R-EXAMINATION-DOCUMENTED-01",
        ComponentKey::Investigations => "R-INVESTIGATIONS-DOCUMENTED-01",
        ComponentKey::Problems => "R-PROBLEMS-DOCUMENTED-01",
        ComponentKey::Medications => "R-MEDICATIONS-DOCUMENTED-01",
        ComponentKey::RiskAssessments => "R-RISKS-DOCUMENTED-01",
        ComponentKey::Impression => "R-IMPRESSION-DOCUMENTED-01",
        ComponentKey::Plan => "R-PLAN-DOCUMENTED-01",
        ComponentKey::Escalation => "R-ESCALATION-DOCUMENTED-01",
        ComponentKey::Communication => "R-COMMUNICATION-DOCUMENTED-01",
    }
}

/// Human-readable description of what documents each component.
const fn rule_description(component: ComponentKey) -> &'static str {
    match component {
        ComponentKey::Header => "Header: note type, date and time, author name and grade recorded",
        ComponentKey::IntervalHistory => {
            "Interval history: events since the last entry recorded, or an explicit no-events"
        }
        ComponentKey::Observations => {
            "Observations: a NEWS2 total recorded, or a full set of the seven NEWS2 parameters"
        }
        ComponentKey::Examination => "Examination: at least one system examined",
        ComponentKey::Investigations => {
            "Investigations: at least one result reviewed, or an explicit none-reviewed"
        }
        ComponentKey::Problems => "Problems: at least one problem on the list",
        ComponentKey::Medications => {
            "Medications: at least one prescribing change, or an explicit no-changes"
        }
        ComponentKey::RiskAssessments => "Risk assessments: VTE status recorded (NICE NG89)",
        ComponentKey::Impression => "Impression: a clinical impression recorded",
        ComponentKey::Plan => "Plan: a narrative plan, or at least one job",
        ComponentKey::Escalation => {
            "Escalation: an escalation status and a ceiling of care recorded"
        }
        ComponentKey::Communication => {
            "Communication: what was discussed with the family, the patient, or the team"
        }
    }
}

fn filled(s: &str) -> bool {
    !s.trim().is_empty()
}

/// Whether each component is documented (spec §4.1).
#[must_use]
pub fn is_documented(note: &InpatientClinicalNote, component: ComponentKey) -> bool {
    match component {
        ComponentKey::Header => {
            note.note_type.is_some()
                && filled(&note.note_at)
                && filled(&note.author_name)
                && filled(&note.author_grade)
        }
        ComponentKey::IntervalHistory => {
            filled(&note.interval_history) || note.no_interval_events == "yes"
        }
        ComponentKey::Observations => {
            note.observations.news2_total.is_some() || has_full_observation_set(&note.observations)
        }
        ComponentKey::Examination => note.examination_documented,
        ComponentKey::Investigations => {
            !note.investigations.is_empty() || note.no_investigations_reviewed == "yes"
        }
        ComponentKey::Problems => note.problem_count > 0,
        ComponentKey::Medications => {
            !note.medications.is_empty() || note.no_medication_changes == "yes"
        }
        ComponentKey::RiskAssessments => filled(&note.vte_status),
        ComponentKey::Impression => filled(&note.clinical_impression),
        ComponentKey::Plan => filled(&note.plan) || note.job_count > 0,
        ComponentKey::Escalation => {
            filled(&note.escalation_status) && filled(&note.ceiling_of_care)
        }
        ComponentKey::Communication => {
            filled(&note.family_communication)
                || filled(&note.patient_communication)
                || filled(&note.team_handover)
        }
    }
}

/// Run both engines over a note and return the full grading result.
#[must_use]
#[allow(clippy::cast_possible_truncation, clippy::cast_precision_loss)]
#[allow(clippy::too_many_lines)] // linear clinical rule list; splitting adds indirection, not clarity
pub fn grade(note: &InpatientClinicalNote) -> NoteGrade {
    let mut component_statuses = Vec::with_capacity(COMPONENTS.len());
    let mut fired_rules: Vec<FiredRule> = Vec::new();
    let mut documented_required = 0usize;
    let mut total_required = 0usize;

    for (component, _) in COMPONENTS {
        let required = is_required(component, note.note_type);
        let present = is_documented(note, component);
        if required {
            total_required += 1;
            if present {
                documented_required += 1;
            }
        }
        if present {
            fired_rules.push(FiredRule {
                id: rule_id(component).to_owned(),
                engine: "completeness".to_owned(),
                component: component.as_str().to_owned(),
                band: None,
                category: if required {
                    "required-component".to_owned()
                } else {
                    "recommended-component".to_owned()
                },
                description: rule_description(component).to_owned(),
            });
        }
        component_statuses.push(ComponentStatus {
            component,
            label: component.label().to_owned(),
            required,
            present,
        });
    }

    let completeness_percent = if total_required == 0 {
        0
    } else {
        ((100.0 * documented_required as f64) / total_required as f64).round() as i32
    };

    let critical_present = CRITICAL.iter().all(|k| is_documented(note, *k));
    let status = if total_required > 0 && documented_required == total_required {
        CompletenessStatus::Complete
    } else if critical_present && documented_required >= total_required.div_ceil(2) {
        CompletenessStatus::Partial
    } else {
        CompletenessStatus::Incomplete
    };

    let acuity = evaluate_acuity(note);
    let computed_acuity_band = acuity.band;

    // An override applies only with a recorded reason; otherwise it is ignored
    // rather than silently applied.
    let acuity_overridden =
        note.author_override_acuity.is_some() && filled(&note.author_override_reason);
    let acuity_band = if acuity_overridden {
        note.author_override_acuity.unwrap_or(computed_acuity_band)
    } else {
        computed_acuity_band
    };

    let flags = detect_flagged_issues(note, acuity_band, documented_required, total_required);

    fired_rules.extend(acuity.fired_rules);
    fired_rules.push(FiredRule {
        id: "R-COMPLETENESS-01".to_owned(),
        engine: "completeness".to_owned(),
        component: "completeness".to_owned(),
        band: None,
        category: "completeness".to_owned(),
        description: if status == CompletenessStatus::Complete {
            format!("All {total_required} required components documented — entry complete (100%)")
        } else {
            format!(
                "{documented_required} of {total_required} required components documented — entry {} ({completeness_percent}%)",
                status.as_str()
            )
        },
    });

    if acuity_overridden {
        fired_rules.push(FiredRule {
            id: "A-AUTHOR-OVERRIDE".to_owned(),
            engine: "acuity".to_owned(),
            component: "acuity".to_owned(),
            band: Some(acuity_band),
            category: "override".to_owned(),
            description: format!(
                "Author overrode the computed acuity band ({}) to {}: {}",
                computed_acuity_band.as_str(),
                acuity_band.as_str(),
                note.author_override_reason.trim()
            ),
        });
    }

    NoteGrade {
        status,
        completeness_percent,
        acuity_band,
        computed_acuity_band,
        acuity_overridden,
        news2_total: acuity.news2.effective,
        news2_derived_total: acuity.news2.derived,
        component_statuses,
        documented_required,
        total_required,
        fired_rules,
        flags,
    }
}
