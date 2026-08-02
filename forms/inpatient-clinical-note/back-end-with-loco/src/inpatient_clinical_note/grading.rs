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

use loco_rs::prelude::*;
use sea_orm::{ColumnTrait, PaginatorTrait, QueryFilter, QueryOrder, TransactionTrait};

use crate::engine::{
    self,
    types::{InvestigationRow, MedicationRow},
    AcuityBand, ComponentKey, InpatientClinicalNote, NoteGrade, NoteType, Observations,
};
use crate::models::_entities::{
    inpatient_clinical_note_grade_flags, inpatient_clinical_note_grade_rules,
    inpatient_clinical_note_grades, inpatient_clinical_note_investigations,
    inpatient_clinical_note_jobs, inpatient_clinical_note_medication_changes,
    inpatient_clinical_note_problems, inpatient_clinical_notes,
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
    db: &DatabaseConnection,
    id: i64,
) -> Result<(inpatient_clinical_notes::Model, NoteGrade)> {
    let note = inpatient_clinical_notes::Entity::find_by_id(id)
        .one(db)
        .await?
        .ok_or_else(|| Error::NotFound)?;

    let problem_count = inpatient_clinical_note_problems::Entity::find()
        .filter(inpatient_clinical_note_problems::Column::InpatientClinicalNoteId.eq(id))
        .filter(inpatient_clinical_note_problems::Column::DeletedAt.is_null())
        .count(db)
        .await? as usize;

    let job_count = inpatient_clinical_note_jobs::Entity::find()
        .filter(inpatient_clinical_note_jobs::Column::InpatientClinicalNoteId.eq(id))
        .filter(inpatient_clinical_note_jobs::Column::DeletedAt.is_null())
        .count(db)
        .await? as usize;

    let investigations = inpatient_clinical_note_investigations::Entity::find()
        .filter(inpatient_clinical_note_investigations::Column::InpatientClinicalNoteId.eq(id))
        .filter(inpatient_clinical_note_investigations::Column::DeletedAt.is_null())
        .order_by_asc(inpatient_clinical_note_investigations::Column::SortOrder)
        .all(db)
        .await?;

    let medications = inpatient_clinical_note_medication_changes::Entity::find()
        .filter(inpatient_clinical_note_medication_changes::Column::InpatientClinicalNoteId.eq(id))
        .filter(inpatient_clinical_note_medication_changes::Column::DeletedAt.is_null())
        .order_by_asc(inpatient_clinical_note_medication_changes::Column::SortOrder)
        .all(db)
        .await?;

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
    db: &DatabaseConnection,
    id: i64,
) -> Result<(inpatient_clinical_note_grades::Model, NoteGrade)> {
    let (_note, result) = grade_note(db, id).await?;

    let txn = db.begin().await?;

    let grade = inpatient_clinical_note_grades::ActiveModel {
        status: Set(result.status.as_str().to_owned()),
        completeness_percent: Set(Some(result.completeness_percent)),
        required_component_count: Set(Some(i32::try_from(result.total_required).unwrap_or(0))),
        documented_component_count: Set(Some(
            i32::try_from(result.documented_required).unwrap_or(0),
        )),
        acuity_band: Set(result.acuity_band.as_str().to_owned()),
        computed_acuity_band: Set(result.computed_acuity_band.as_str().to_owned()),
        news2_total: Set(result.news2_total),
        header_documented: Set(documented(&result, ComponentKey::Header)),
        interval_history_documented: Set(documented(&result, ComponentKey::IntervalHistory)),
        observations_documented: Set(documented(&result, ComponentKey::Observations)),
        examination_documented: Set(documented(&result, ComponentKey::Examination)),
        investigations_documented: Set(documented(&result, ComponentKey::Investigations)),
        problems_documented: Set(documented(&result, ComponentKey::Problems)),
        medications_documented: Set(documented(&result, ComponentKey::Medications)),
        risk_assessments_documented: Set(documented(&result, ComponentKey::RiskAssessments)),
        impression_documented: Set(documented(&result, ComponentKey::Impression)),
        plan_documented: Set(documented(&result, ComponentKey::Plan)),
        escalation_documented: Set(documented(&result, ComponentKey::Escalation)),
        communication_documented: Set(documented(&result, ComponentKey::Communication)),
        graded_at: Set(chrono::Utc::now().into()),
        inpatient_clinical_note_id: Set(id),
        ..Default::default()
    }
    .insert(&txn)
    .await?;

    for rule in &result.fired_rules {
        inpatient_clinical_note_grade_rules::ActiveModel {
            rule_id: Set(rule.id.clone()),
            engine: Set(rule.engine.clone()),
            component: Set(rule.component.clone()),
            band: Set(rule.band.map(AcuityBand::as_str).unwrap_or("").to_owned()),
            category: Set(rule.category.clone()),
            description: Set(rule.description.clone()),
            inpatient_clinical_note_grade_id: Set(grade.id),
            ..Default::default()
        }
        .insert(&txn)
        .await?;
    }

    for issue in &result.flags {
        inpatient_clinical_note_grade_flags::ActiveModel {
            flag_id: Set(issue.id.clone()),
            category: Set(issue.category.clone()),
            priority: Set(issue.priority.as_str().to_owned()),
            description: Set(issue.description.clone()),
            suggested_action: Set(issue.suggested_action.clone()),
            inpatient_clinical_note_grade_id: Set(grade.id),
            ..Default::default()
        }
        .insert(&txn)
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
pub async fn latest_grade(
    db: &DatabaseConnection,
    id: i64,
) -> Result<inpatient_clinical_note_grades::Model> {
    inpatient_clinical_note_grades::Entity::find()
        .filter(inpatient_clinical_note_grades::Column::InpatientClinicalNoteId.eq(id))
        .filter(inpatient_clinical_note_grades::Column::DeletedAt.is_null())
        .order_by_desc(inpatient_clinical_note_grades::Column::GradedAt)
        .order_by_desc(inpatient_clinical_note_grades::Column::Id)
        .one(db)
        .await?
        .ok_or_else(|| Error::NotFound)
}
