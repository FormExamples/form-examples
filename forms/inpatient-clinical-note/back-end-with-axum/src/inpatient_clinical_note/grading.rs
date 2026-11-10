//! Server-side grading of a persisted note.
//!
//! The engines in [`crate::engine`] are pure functions over an
//! [`InpatientClinicalNote`] value. This module is the bridge between them and
//! the relational schema: it loads a note and its four child collections,
//! projects them onto the engine's input shape, runs
//! [`crate::engine::grade`], and persists the result as one
//! `inpatient_clinical_note_grade` row plus its
//! `inpatient_clinical_note_grade_rule` and
//! `inpatient_clinical_note_grade_flag` children.
//!
//! Grading is **append-only**: each run inserts a new grade row rather than
//! updating the last one, so the grading history of a note stays auditable and
//! `graded_at` means what it says. Readers want the most recent row.
//!
//! No clinical rule lives here. When a rule changes, it changes in
//! [`crate::engine`] and in both front-end engines — never in this mapping.

use crate::support::prelude::*;

use crate::engine::{
    self,
    types::{InvestigationRow, MedicationRow},
    AcuityBand, ComponentKey, InpatientClinicalNote, NoteGrade, NoteType, Observations,
};
use crate::models::{
    inpatient_clinical_note_grade_flags, inpatient_clinical_note_grade_rules,
    inpatient_clinical_note_grades, inpatient_clinical_note_investigations,
    inpatient_clinical_note_medication_changes, inpatient_clinical_notes,
};

/// Render an optional timestamp as RFC 3339, which is one of the formats the
/// engine's date parsing accepts. Absent becomes the empty string, the
/// convention for an unanswered field.
fn timestamp(value: Option<DateTimeWithTimeZone>) -> String {
    value.map(|d| d.to_rfc3339()).unwrap_or_default()
}

/// Project the stored note and its children onto the engine's input shape.
///
/// Only the fields the engines actually read are carried across; the rest of
/// the record stays in the database.
#[must_use]
pub fn to_engine_note(
    note: &inpatient_clinical_notes::Model,
    problem_count: usize,
    job_count: usize,
    investigations: &[inpatient_clinical_note_investigations::Model],
    medications: &[inpatient_clinical_note_medication_changes::Model],
) -> InpatientClinicalNote {
    // Any documented system counts as an examination (spec §4.1).
    let examination_documented = [
        &note.examination_general,
        &note.examination_cardiovascular,
        &note.examination_respiratory,
        &note.examination_abdominal,
        &note.examination_neurological,
        &note.examination_musculoskeletal,
        &note.examination_skin_and_wounds,
        &note.examination_lines_and_drains,
        &note.examination_other,
    ]
    .iter()
    .any(|field| !field.trim().is_empty());

    InpatientClinicalNote {
        note_type: NoteType::from_wire(&note.note_type),
        note_at: timestamp(note.note_at),
        author_name: note.author_name.clone(),
        author_grade: note.author_grade.clone(),
        admission_at: timestamp(note.admission_at),

        interval_history: note.interval_history.clone(),
        no_interval_events: note.no_interval_events.clone(),

        observations: Observations {
            respiratory_rate: note.respiratory_rate,
            oxygen_saturation: note.oxygen_saturation,
            spo2_scale: note.spo2_scale.clone(),
            oxygen_delivery: note.oxygen_delivery.clone(),
            systolic_blood_pressure: note.systolic_blood_pressure,
            pulse_rate: note.pulse_rate,
            acvpu: note.acvpu.clone(),
            // `Decimal` has no infallible float conversion; its `Display` is
            // exact for the one-decimal-place temperatures the form records.
            temperature_celsius: note
                .temperature_celsius
                .and_then(|d| d.to_string().parse::<f64>().ok()),
            news2_total: note.news2_total,
            news2_trend: note.news2_trend.clone(),
        },

        examination_documented,

        investigations: investigations
            .iter()
            .map(|row| InvestigationRow {
                test_name: row.test_name.clone(),
                abnormal: row.abnormal.clone(),
                actioned: row.actioned.clone(),
            })
            .collect(),
        no_investigations_reviewed: note.no_investigations_reviewed.clone(),

        problem_count,

        medications: medications
            .iter()
            .map(|row| MedicationRow {
                drug_name: row.drug_name.clone(),
                action: row.action.clone(),
                is_antimicrobial: row.is_antimicrobial.clone(),
            })
            .collect(),
        no_medication_changes: note.no_medication_changes.clone(),
        allergy_checked: note.allergy_checked.clone(),
        antimicrobial_review_status: note.antimicrobial_review_status.clone(),

        vte_status: note.vte_status.clone(),

        clinical_impression: note.clinical_impression.clone(),
        new_oxygen_requirement: note.new_oxygen_requirement.clone(),
        new_confusion: note.new_confusion.clone(),
        sepsis_screen: note.sepsis_screen.clone(),
        arrest_call: note.arrest_call.clone(),
        critical_care_referral: note.critical_care_referral.clone(),
        new_organ_support: note.new_organ_support.clone(),

        plan: note.plan.clone(),
        job_count,
        escalation_status: note.escalation_status.clone(),
        escalation_action: note.escalation_action.clone(),
        ceiling_of_care: note.ceiling_of_care.clone(),
        senior_review_by: note.senior_review_by.clone(),
        estimated_discharge_date: note
            .estimated_discharge_date
            .map(|d| d.to_string())
            .unwrap_or_default(),

        family_communication: note.family_communication.clone(),
        patient_communication: note.patient_communication.clone(),
        team_handover: note.team_handover.clone(),
        consent_status: note.consent_status.clone(),
        capacity_assessed: note.capacity_assessed.clone(),

        author_override_acuity: AcuityBand::from_wire(&note.author_override_acuity),
        author_override_reason: note.author_override_reason.clone(),
    }
}

/// Load the note identified by `id` together with its four child collections,
/// and run both engines over it. Soft-deleted children are excluded.
///
/// # Errors
///
/// Returns [`Error::NotFound`] if no such note exists, or a database error.
pub async fn grade_note(
    db: &PgPool,
    id: Uuid,
) -> Result<(inpatient_clinical_notes::Model, NoteGrade)> {
    let note = inpatient_clinical_notes::Model::find_by_id(db, id)
        .await?
        .ok_or_else(|| Error::NotFound)?;

    // sqlx counts are u64; row counts trivially fit usize on supported
    // (64-bit) targets, and try_from keeps 32-bit targets honest.
    let problem_count = usize::try_from(
        sqlx::query_scalar::<_, i64>("SELECT COUNT(*) FROM inpatient_clinical_note_problems WHERE inpatient_clinical_note_id = $1 AND deleted_at IS NULL").bind(id).fetch_one(db).await?,
    )
    .unwrap_or(usize::MAX);

    let job_count = usize::try_from(
        sqlx::query_scalar::<_, i64>("SELECT COUNT(*) FROM inpatient_clinical_note_jobs WHERE inpatient_clinical_note_id = $1 AND deleted_at IS NULL").bind(id).fetch_one(db).await?,
    )
    .unwrap_or(usize::MAX);

    let investigations = sqlx::query_as::<_, inpatient_clinical_note_investigations::Model>("SELECT * FROM inpatient_clinical_note_investigations WHERE inpatient_clinical_note_id = $1 AND deleted_at IS NULL ORDER BY sort_order ASC").bind(id).fetch_all(db).await?;

    let medications = sqlx::query_as::<_, inpatient_clinical_note_medication_changes::Model>("SELECT * FROM inpatient_clinical_note_medication_changes WHERE inpatient_clinical_note_id = $1 AND deleted_at IS NULL ORDER BY sort_order ASC").bind(id).fetch_all(db).await?;

    let engine_note = to_engine_note(
        &note,
        problem_count,
        job_count,
        &investigations,
        &medications,
    );
    let result = engine::grade(&engine_note);
    Ok((note, result))
}

/// `yes` / `no` for a component's presence, matching the CHECK constraints on
/// the twelve `*_documented` columns.
fn documented(result: &NoteGrade, component: ComponentKey) -> String {
    let present = result
        .component_statuses
        .iter()
        .any(|status| status.component == component && status.present);
    if present { "yes" } else { "no" }.to_owned()
}

/// Grade the note identified by `id` and persist the result.
///
/// The grade row and its rule and flag children are written in one transaction,
/// so a partially-written audit trail is never visible.
///
/// # Errors
///
/// Returns [`Error::NotFound`] if no such note exists, or a database error.
pub async fn grade_and_persist(
    db: &PgPool,
    id: Uuid,
) -> Result<(inpatient_clinical_note_grades::Model, NoteGrade)> {
    let (_note, result) = grade_note(db, id).await?;

    let mut txn = db.begin().await?;

    let grade = sqlx::query_as::<_, inpatient_clinical_note_grades::Model>(
        "INSERT INTO inpatient_clinical_note_grades (status, completeness_percent, \
        required_component_count, documented_component_count, acuity_band, \
        computed_acuity_band, news2_total, header_documented, \
        interval_history_documented, observations_documented, examination_documented, \
        investigations_documented, problems_documented, medications_documented, \
        risk_assessments_documented, impression_documented, plan_documented, \
        escalation_documented, communication_documented, graded_at, \
        inpatient_clinical_note_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, \
        $12, $13, $14, $15, $16, $17, $18, $19, $20, $21) RETURNING *",
    )
    .bind(result.status.as_str().to_owned())
    .bind(Some(result.completeness_percent))
    .bind(Some(i32::try_from(result.total_required).unwrap_or(0)))
    .bind(Some(i32::try_from(result.documented_required).unwrap_or(0)))
    .bind(result.acuity_band.as_str().to_owned())
    .bind(result.computed_acuity_band.as_str().to_owned())
    .bind(result.news2_total)
    .bind(documented(&result, ComponentKey::Header))
    .bind(documented(&result, ComponentKey::IntervalHistory))
    .bind(documented(&result, ComponentKey::Observations))
    .bind(documented(&result, ComponentKey::Examination))
    .bind(documented(&result, ComponentKey::Investigations))
    .bind(documented(&result, ComponentKey::Problems))
    .bind(documented(&result, ComponentKey::Medications))
    .bind(documented(&result, ComponentKey::RiskAssessments))
    .bind(documented(&result, ComponentKey::Impression))
    .bind(documented(&result, ComponentKey::Plan))
    .bind(documented(&result, ComponentKey::Escalation))
    .bind(documented(&result, ComponentKey::Communication))
    .bind(chrono::Utc::now())
    .bind(id)
    .fetch_one(&mut *txn)
    .await?;

    for rule in &result.fired_rules {
        sqlx::query_as::<_, inpatient_clinical_note_grade_rules::Model>(
            "INSERT INTO inpatient_clinical_note_grade_rules (rule_id, engine, component, \
        band, category, description, inpatient_clinical_note_grade_id) VALUES ($1, $2, \
        $3, $4, $5, $6, $7) RETURNING *",
        )
        .bind(rule.id.clone())
        .bind(rule.engine.clone())
        .bind(rule.component.clone())
        .bind(rule.band.map_or("", AcuityBand::as_str).to_owned())
        .bind(rule.category.clone())
        .bind(rule.description.clone())
        .bind(grade.id)
        .fetch_one(&mut *txn)
        .await?;
    }

    for issue in &result.flags {
        sqlx::query_as::<_, inpatient_clinical_note_grade_flags::Model>(
            "INSERT INTO inpatient_clinical_note_grade_flags (flag_id, category, priority, \
        description, suggested_action, inpatient_clinical_note_grade_id) VALUES ($1, $2, \
        $3, $4, $5, $6) RETURNING *",
        )
        .bind(issue.id.clone())
        .bind(issue.category.clone())
        .bind(issue.priority.as_str().to_owned())
        .bind(issue.description.clone())
        .bind(issue.suggested_action.clone())
        .bind(grade.id)
        .fetch_one(&mut *txn)
        .await?;
    }

    txn.commit().await?;

    Ok((grade, result))
}

/// Fetch the most recent persisted grade for the note identified by `id`.
///
/// # Errors
///
/// Returns [`Error::NotFound`] if the note has never been graded, or a
/// database error.
pub async fn latest_grade(db: &PgPool, id: Uuid) -> Result<inpatient_clinical_note_grades::Model> {
    sqlx::query_as::<_, inpatient_clinical_note_grades::Model>("SELECT * FROM inpatient_clinical_note_grades WHERE inpatient_clinical_note_id = $1 AND deleted_at IS NULL ORDER BY graded_at DESC, id DESC").bind(id).fetch_optional(db).await?
        .ok_or_else(|| Error::NotFound)
}
