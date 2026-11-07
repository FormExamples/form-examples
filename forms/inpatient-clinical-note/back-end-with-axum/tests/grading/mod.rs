//! Tests for server-side grading: the DB → engine projection, and persistence
//! of the grade with its rule and flag audit trail.
//!
//! Persisting is the point of these tests. Every enumerated column on the three
//! grade tables carries a CHECK constraint, so an insert that succeeds proves
//! the engine's vocabulary matches the schema's — in particular that fired-rule
//! `component` values are kebab-case (`interval-history`), not the Rust `Debug`
//! spelling (`IntervalHistory`), which the constraint rejects.

#[allow(unused_imports)]
use crate::{db, seed};
use axa::testing::prelude::*;
use inpatient_clinical_note::app::App;
use inpatient_clinical_note::grading::{grade_and_persist, latest_grade, to_engine_note};
use inpatient_clinical_note::models::{
    clinicians, inpatient_clinical_note_grade_flags, inpatient_clinical_note_grade_rules,
    inpatient_clinical_note_investigations, inpatient_clinical_note_problems,
    inpatient_clinical_notes,
};
use serial_test::serial;
use sqlx::PgPool;
use uuid::Uuid;

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

/// Insert a clinician with realistic registration details.
async fn insert_clinician(db: &PgPool, name: &str, grade: &str) -> clinicians::Model {
    sqlx::query_as(
        "INSERT INTO clinicians (name, role, grade, specialty, registration_body, \
         registration_number) VALUES ($1, 'foundation-doctor', $2, 'general-internal-medicine', \
         'GMC', '0000000') RETURNING *",
    )
    .bind(name)
    .bind(grade)
    .fetch_one(db)
    .await
    .expect("insert clinician")
}

/// Insert a patient, an author, and a consultant, returning
/// `(patient_id, author_id, consultant_id)`.
async fn seed_people(db: &PgPool) -> (Uuid, Uuid, Uuid) {
    let patient = sqlx::query_as::<_, inpatient_clinical_note::models::patients::Model>(
        "INSERT INTO patients (name, birth_date, sex) VALUES ($1, $2, $3) RETURNING *",
    )
    .bind("Test Patient".to_owned())
    .bind(chrono::NaiveDate::from_ymd_opt(1948, 3, 12).unwrap())
    .bind("female".to_owned())
    .fetch_one(db)
    .await
    .expect("insert patient");

    let author = insert_clinician(db, "Dr A. Okafor", "ST4").await;

    let consultant = insert_clinician(db, "Dr B. Nakamura", "consultant").await;

    (patient.id, author.id, consultant.id)
}

/// A progress note with every base component documented and normal
/// observations, so it grades `complete` / `stable`.
async fn seed_complete_note(db: &PgPool) -> Uuid {
    let (patient_id, author_id, consultant_id) = seed_people(db).await;

    let note = sqlx::query_as::<_, inpatient_clinical_notes::Model>(
        "INSERT INTO inpatient_clinical_notes (note_type, note_at, admission_at, \
        author_name, author_grade, no_interval_events, respiratory_rate, \
        oxygen_saturation, spo2_scale, oxygen_delivery, systolic_blood_pressure, \
        pulse_rate, acvpu, temperature_celsius, examination_general, \
        no_investigations_reviewed, no_medication_changes, allergy_checked, vte_status, \
        clinical_impression, plan, escalation_status, ceiling_of_care, senior_review_by, \
        team_handover, consent_status, capacity_assessed, patient_id, author_id, \
        responsible_consultant_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, \
        $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, \
        $28, $29, $30) RETURNING *",
    )
    .bind("progress".to_owned())
    .bind(Some(
        chrono::DateTime::parse_from_rfc3339("2026-07-31T09:00:00Z").unwrap(),
    ))
    .bind(Some(
        chrono::DateTime::parse_from_rfc3339("2026-07-29T14:00:00Z").unwrap(),
    ))
    .bind("Dr A. Okafor".to_owned())
    .bind("ST4".to_owned())
    .bind("yes".to_owned())
    .bind(Some(16))
    .bind(Some(97))
    .bind("scale-1".to_owned())
    .bind("air".to_owned())
    .bind(Some(128))
    .bind(Some(78))
    .bind("alert".to_owned())
    .bind(Some(rust_decimal::Decimal::new(368, 1)))
    .bind("Comfortable at rest.".to_owned())
    .bind("yes".to_owned())
    .bind("yes".to_owned())
    .bind("yes".to_owned())
    .bind("done".to_owned())
    .bind("Resolving pneumonia.".to_owned())
    .bind("Continue antibiotics.".to_owned())
    .bind("for-full-escalation".to_owned())
    .bind("full-active-treatment".to_owned())
    .bind("Dr B. Nakamura".to_owned())
    .bind("Handed over to the night team.".to_owned())
    .bind("consented".to_owned())
    .bind("yes".to_owned())
    .bind(patient_id)
    .bind(author_id)
    .bind(Some(consultant_id))
    .fetch_one(db)
    .await
    .expect("insert note");

    // One problem, so the problems component is documented.
    sqlx::query_as::<_, inpatient_clinical_note_problems::Model>(
        "INSERT INTO inpatient_clinical_note_problems (sort_order, problem, status, \
        inpatient_clinical_note_id) VALUES ($1, $2, $3, $4) RETURNING *",
    )
    .bind(1)
    .bind("Community-acquired pneumonia".to_owned())
    .bind("active".to_owned())
    .bind(note.id)
    .fetch_one(db)
    .await
    .expect("insert problem");

    note.id
}

#[tokio::test]
#[serial]
async fn grading_persists_the_grade_and_its_audit_trail() {
    let boot = boot_test::<App>().await.unwrap();
    let db = &db(&boot.app_context);
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
        assert!(
            value == "yes" || value == "no",
            "unexpected value {value:?}"
        );
    }

    // The rule rows landed, and every `component` satisfies the CHECK
    // constraint's vocabulary.
    let rules = sqlx::query_as::<_, inpatient_clinical_note_grade_rules::Model>("SELECT * FROM inpatient_clinical_note_grade_rules WHERE inpatient_clinical_note_grade_id = $1").bind(grade.id).fetch_all(db).await
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

    let flags = sqlx::query_as::<_, inpatient_clinical_note_grade_flags::Model>("SELECT * FROM inpatient_clinical_note_grade_flags WHERE inpatient_clinical_note_grade_id = $1").bind(grade.id).fetch_all(db).await
        .expect("load flags");
    assert_eq!(flags.len(), result.flags.len());
}

#[tokio::test]
#[serial]
async fn grading_is_append_only_and_the_latest_wins() {
    let boot = boot_test::<App>().await.unwrap();
    let db = &db(&boot.app_context);
    let note_id = seed_complete_note(db).await;

    let (first, _) = grade_and_persist(db, note_id).await.expect("first grading");

    // Remove the impression, which is a critical component: the note drops out
    // of `complete`.
    let note = inpatient_clinical_notes::Model::find_by_id(db, note_id)
        .await
        .unwrap()
        .unwrap();
    sqlx::query("UPDATE inpatient_clinical_notes SET clinical_impression = $2 WHERE id = $1")
        .bind(note.id)
        .bind(String::new())
        .execute(db)
        .await
        .expect("blank the impression");

    let (second, _) = grade_and_persist(db, note_id)
        .await
        .expect("second grading");

    assert_ne!(
        first.id, second.id,
        "grading must not overwrite its history"
    );
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
    let db = &db(&boot.app_context);
    let note_id = seed_complete_note(db).await;

    // An investigation row documents the investigations component on its own.
    let investigation = sqlx::query_as::<_, inpatient_clinical_note_investigations::Model>(
        "INSERT INTO inpatient_clinical_note_investigations (sort_order, test_name, \
        abnormal, actioned, inpatient_clinical_note_id) VALUES ($1, $2, $3, $4, $5) \
        RETURNING *",
    )
    .bind(1)
    .bind("Chest radiograph".to_owned())
    .bind("no".to_owned())
    .bind("yes".to_owned())
    .bind(note_id)
    .fetch_one(db)
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
    sqlx::query("UPDATE inpatient_clinical_note_investigations SET deleted_at = $2 WHERE id = $1")
        .bind(investigation.id)
        .bind(Some(chrono::Utc::now()))
        .execute(db)
        .await
        .expect("soft-delete");

    let note = inpatient_clinical_notes::Model::find_by_id(db, note_id)
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
    let result = grade_and_persist(&db(&boot.app_context), Uuid::from_u128(987_654)).await;
    assert!(result.is_err(), "grading an absent note must not succeed");
}

#[tokio::test]
#[serial]
async fn the_grade_endpoints_round_trip_over_http() {
    request::<App, _, _>(|request, ctx| async move {
        let note_id = seed_complete_note(&db(&ctx)).await;

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
        // The grade row is a sqlx entity; like every entity controller in
        // this crate (and fleet-wide, per bin/loco-camel-case-json-refactor),
        // its keys are camelCase. The engine result nested beside it was
        // already hand-written as camelCase.
        assert_eq!(body["grade"]["status"], "complete");
        assert_eq!(body["grade"]["acuityBand"], "stable");
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
        assert_eq!(
            after.json::<serde_json::Value>()["grade"]["status"],
            "complete"
        );
    })
    .await;
}

#[tokio::test]
#[serial]
async fn grading_an_absent_note_over_http_is_404() {
    request::<App, _, _>(|request, _ctx| async move {
        let response = request
            .post("/api/inpatient_clinical_notes/00000000-0000-0000-0000-0000000fa0c6/grade")
            .await;
        assert_eq!(response.status_code(), 404);
    })
    .await;
}
