//! Tests for server-side grading: the DB → engine projection, and persistence
//! of the grade with its rule and flag audit trail.
//!
//! Persisting is the point of these tests. Every enumerated column on the three
//! grade tables carries a CHECK constraint, so an insert that succeeds proves
//! the engine's vocabulary matches the schema's — in particular that fired-rule
//! `component` values are kebab-case (`interval-history`), not the Rust `Debug`
//! spelling (`IntervalHistory`), which the constraint rejects.

use inpatient_clinical_note::app::App;
use inpatient_clinical_note::grading::{grade_and_persist, latest_grade, to_engine_note};
use inpatient_clinical_note::models::_entities::{
    clinicians, inpatient_clinical_note_grade_flags, inpatient_clinical_note_grade_rules,
    inpatient_clinical_note_investigations, inpatient_clinical_note_problems,
    inpatient_clinical_notes,
};
use loco_rs::testing::prelude::*;
use sea_orm::{ActiveModelTrait, ColumnTrait, EntityTrait, QueryFilter, Set};
use serial_test::serial;

/// The `component` values the `inpatient_clinical_note_grade_rule` CHECK
/// constraint permits, copied from `sql/10_create_table_…_grade_rule.sql`.
const ALLOWED_COMPONENTS: &[&str] = &[
    "header",
    "interval-history",
    "observations",
    "examination",
    "investigations",
    "problems",
    "medications",
    "risk-assessments",
    "impression",
    "plan",
    "escalation",
    "communication",
    "completeness",
    "acuity",
    "",
];

/// A clinician with realistic registration details.
fn clinician(name: &str, grade: &str) -> clinicians::ActiveModel {
    clinicians::ActiveModel {
        name: Set(name.to_owned()),
        role: Set("doctor".to_owned()),
        grade: Set(grade.to_owned()),
        specialty: Set("general-internal-medicine".to_owned()),
        registration_body: Set("GMC".to_owned()),
        registration_number: Set("0000000".to_owned()),
        ..Default::default()
    }
}

/// Insert a patient, an author, and a consultant, returning
/// `(patient_id, author_id, consultant_id)`.
async fn seed_people(db: &sea_orm::DatabaseConnection) -> (i64, i64, i64) {
    let patient = inpatient_clinical_note::models::_entities::patients::ActiveModel {
        name: Set("Test Patient".to_owned()),
        birth_date: Set(chrono::NaiveDate::from_ymd_opt(1948, 3, 12).unwrap()),
        sex: Set("female".to_owned()),
        ..Default::default()
    }
    .insert(db)
    .await
    .expect("insert patient");

    let author = clinician("Dr A. Okafor", "ST4")
        .insert(db)
        .await
        .expect("insert author");

    let consultant = clinician("Dr B. Nakamura", "consultant")
        .insert(db)
        .await
        .expect("insert consultant");

    (patient.id, author.id, consultant.id)
}

/// A progress note with every base component documented and normal
/// observations, so it grades `complete` / `stable`.
async fn seed_complete_note(db: &sea_orm::DatabaseConnection) -> i64 {
    let (patient_id, author_id, consultant_id) = seed_people(db).await;

    let note = inpatient_clinical_notes::ActiveModel {
        note_type: Set("progress".to_owned()),
        note_at: Set(Some(
            chrono::DateTime::parse_from_rfc3339("2026-07-31T09:00:00Z").unwrap(),
        )),
        admission_at: Set(Some(
            chrono::DateTime::parse_from_rfc3339("2026-07-29T14:00:00Z").unwrap(),
        )),
        author_name: Set("Dr A. Okafor".to_owned()),
        author_grade: Set("ST4".to_owned()),
        no_interval_events: Set("yes".to_owned()),
        respiratory_rate: Set(Some(16)),
        oxygen_saturation: Set(Some(97)),
        spo2_scale: Set("scale-1".to_owned()),
        oxygen_delivery: Set("air".to_owned()),
        systolic_blood_pressure: Set(Some(128)),
        pulse_rate: Set(Some(78)),
        acvpu: Set("alert".to_owned()),
        temperature_celsius: Set(Some(sea_orm::prelude::Decimal::new(368, 1))),
        examination_general: Set("Comfortable at rest.".to_owned()),
        no_investigations_reviewed: Set("yes".to_owned()),
        no_medication_changes: Set("yes".to_owned()),
        allergy_checked: Set("yes".to_owned()),
        vte_status: Set("done".to_owned()),
        clinical_impression: Set("Resolving pneumonia.".to_owned()),
        plan: Set("Continue antibiotics.".to_owned()),
        escalation_status: Set("for-full-escalation".to_owned()),
        ceiling_of_care: Set("full-active-treatment".to_owned()),
        senior_review_by: Set("Dr B. Nakamura".to_owned()),
        team_handover: Set("Handed over to the night team.".to_owned()),
        consent_status: Set("capacitous-consent".to_owned()),
        capacity_assessed: Set("yes".to_owned()),
        patient_id: Set(patient_id),
        author_id: Set(author_id),
        responsible_consultant_id: Set(consultant_id),
        ..Default::default()
    }
    .insert(db)
    .await
    .expect("insert note");

    // One problem, so the problems component is documented.
    inpatient_clinical_note_problems::ActiveModel {
        sort_order: Set(1),
        problem: Set("Community-acquired pneumonia".to_owned()),
        status: Set("active".to_owned()),
        inpatient_clinical_note_id: Set(note.id),
        ..Default::default()
    }
    .insert(db)
    .await
    .expect("insert problem");

    note.id
}

#[tokio::test]
#[serial]
async fn grading_persists_the_grade_and_its_audit_trail() {
    let boot = boot_test::<App>().await.unwrap();
    let db = &boot.app_context.db;
    let note_id = seed_complete_note(db).await;

    let (grade, result) = grade_and_persist(db, note_id).await.expect("grade");

    // Both engines agree with the in-memory engine tests for this note.
    assert_eq!(grade.status, "complete");
    assert_eq!(grade.acuity_band, "stable");
    assert_eq!(grade.computed_acuity_band, "stable");
    assert_eq!(grade.completeness_percent, Some(100));
    assert_eq!(grade.news2_total, Some(0));
    assert_eq!(grade.inpatient_clinical_note_id, note_id);

    // The twelve per-component columns are `yes` / `no`, never empty.
    for value in [
        &grade.header_documented,
        &grade.interval_history_documented,
        &grade.observations_documented,
        &grade.examination_documented,
        &grade.investigations_documented,
        &grade.problems_documented,
        &grade.medications_documented,
        &grade.risk_assessments_documented,
        &grade.impression_documented,
        &grade.plan_documented,
        &grade.escalation_documented,
        &grade.communication_documented,
    ] {
        assert!(value == "yes" || value == "no", "unexpected value {value:?}");
    }

    // The rule rows landed, and every `component` satisfies the CHECK
    // constraint's vocabulary.
    let rules = inpatient_clinical_note_grade_rules::Entity::find()
        .filter(
            inpatient_clinical_note_grade_rules::Column::InpatientClinicalNoteGradeId.eq(grade.id),
        )
        .all(db)
        .await
        .expect("load rules");
    assert_eq!(rules.len(), result.fired_rules.len());
    assert!(!rules.is_empty());
    for rule in &rules {
        assert!(
            ALLOWED_COMPONENTS.contains(&rule.component.as_str()),
            "component {:?} violates the schema constraint",
            rule.component
        );
        assert!(rule.engine == "completeness" || rule.engine == "acuity");
    }

    let flags = inpatient_clinical_note_grade_flags::Entity::find()
        .filter(
            inpatient_clinical_note_grade_flags::Column::InpatientClinicalNoteGradeId.eq(grade.id),
        )
        .all(db)
        .await
        .expect("load flags");
    assert_eq!(flags.len(), result.flags.len());
}

#[tokio::test]
#[serial]
async fn grading_is_append_only_and_the_latest_wins() {
    let boot = boot_test::<App>().await.unwrap();
    let db = &boot.app_context.db;
    let note_id = seed_complete_note(db).await;

    let (first, _) = grade_and_persist(db, note_id).await.expect("first grading");

    // Remove the impression, which is a critical component: the note drops out
    // of `complete`.
    let note = inpatient_clinical_notes::Entity::find_by_id(note_id)
        .one(db)
        .await
        .unwrap()
        .unwrap();
    let mut note: inpatient_clinical_notes::ActiveModel = note.into();
    note.clinical_impression = Set(String::new());
    note.update(db).await.expect("blank the impression");

    let (second, _) = grade_and_persist(db, note_id).await.expect("second grading");

    assert_ne!(first.id, second.id, "grading must not overwrite its history");
    assert_eq!(first.status, "complete");
    assert_ne!(second.status, "complete");

    // The reader gets the most recent grading.
    let latest = latest_grade(db, note_id).await.expect("latest grade");
    assert_eq!(latest.id, second.id);
}

#[tokio::test]
#[serial]
async fn soft_deleted_children_are_excluded_from_grading() {
    let boot = boot_test::<App>().await.unwrap();
    let db = &boot.app_context.db;
    let note_id = seed_complete_note(db).await;

    // An investigation row documents the investigations component on its own.
    let investigation = inpatient_clinical_note_investigations::ActiveModel {
        sort_order: Set(1),
        test_name: Set("Chest radiograph".to_owned()),
        abnormal: Set("no".to_owned()),
        actioned: Set("yes".to_owned()),
        inpatient_clinical_note_id: Set(note_id),
        ..Default::default()
    }
    .insert(db)
    .await
    .expect("insert investigation");

    let (_, before) = grade_and_persist(db, note_id).await.expect("grade");
    assert_eq!(
        before
            .fired_rules
            .iter()
            .filter(|r| r.component == "investigations")
            .count(),
        1
    );

    // Soft-delete it; the projection must stop seeing it.
    let mut investigation: inpatient_clinical_note_investigations::ActiveModel =
        investigation.into();
    investigation.deleted_at = Set(Some(chrono::Utc::now().into()));
    investigation.update(db).await.expect("soft-delete");

    let note = inpatient_clinical_notes::Entity::find_by_id(note_id)
        .one(db)
        .await
        .unwrap()
        .unwrap();
    let engine_note = to_engine_note(&note, 1, 0, &[], &[]);
    assert!(engine_note.investigations.is_empty());
}

#[tokio::test]
#[serial]
async fn grading_a_missing_note_is_not_found() {
    let boot = boot_test::<App>().await.unwrap();
    let result = grade_and_persist(&boot.app_context.db, 987_654).await;
    assert!(result.is_err(), "grading an absent note must not succeed");
}

#[tokio::test]
#[serial]
async fn the_grade_endpoints_round_trip_over_http() {
    request::<App, _, _>(|request, ctx| async move {
        let note_id = seed_complete_note(&ctx.db).await;

        // Nothing graded yet.
        let before = request
            .get(&format!("/api/inpatient_clinical_notes/{note_id}/grade"))
            .await;
        assert_eq!(before.status_code(), 404);

        // Grading returns both the persisted row and the engine result.
        let posted = request
            .post(&format!("/api/inpatient_clinical_notes/{note_id}/grade"))
            .await;
        assert_eq!(posted.status_code(), 200);
        let body: serde_json::Value = posted.json();
        // The grade row is a SeaORM entity, so its keys are snake_case, as with
        // every other entity controller in this crate. The engine result
        // carries `rename_all = "camelCase"`, matching the front-end engines.
        assert_eq!(body["grade"]["status"], "complete");
        assert_eq!(body["grade"]["acuity_band"], "stable");
        assert_eq!(body["result"]["status"], "complete");
        assert_eq!(body["result"]["computedAcuityBand"], "stable");
        assert!(
            body["result"]["firedRules"]
                .as_array()
                .expect("firedRules is an array")
                .iter()
                .any(|r| r["component"] == "interval-history"),
            "fired rules must use the kebab-case component vocabulary"
        );

        // And it is now readable.
        let after = request
            .get(&format!("/api/inpatient_clinical_notes/{note_id}/grade"))
            .await;
        assert_eq!(after.status_code(), 200);
        assert_eq!(after.json::<serde_json::Value>()["grade"]["status"], "complete");
    })
    .await;
}

#[tokio::test]
#[serial]
async fn grading_an_absent_note_over_http_is_404() {
    request::<App, _, _>(|request, _ctx| async move {
        let response = request
            .post("/api/inpatient_clinical_notes/987654/grade")
            .await;
        assert_eq!(response.status_code(), 404);
    })
    .await;
}
