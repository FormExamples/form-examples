#![forbid(unsafe_code)]

use axa_test::prelude::*;
use cardiology_request_axum_crate::app::App;
use serial_test::serial;
use uuid::Uuid;

#[tokio::test]
#[serial]
async fn delete_hides_the_row_and_keeps_it() {
    request::<App, _, _>(|request, ctx| async move {
        let row0: Uuid = sqlx::query_scalar(
            "INSERT INTO patients (name, birth_date) VALUES ('', '2026-01-01') RETURNING \
            id",
        )
        .fetch_one(&ctx.db)
        .await
        .unwrap();
        let row1: Uuid = sqlx::query_scalar(
            "INSERT INTO clinicians (name, role, registration_body, registration_number) \
            VALUES ('', '', '', '') RETURNING id",
        )
        .fetch_one(&ctx.db)
        .await
        .unwrap();
        let row2: Uuid = sqlx::query_scalar(
            "INSERT INTO cardiology_requests (patient_id, clinician_id, status, \
            site_name, setting, requested_service, referral_reason, clinical_question, \
            relevant_history, symptom_chest_pain, chest_pain_character, \
            symptom_breathlessness, nyha_class, symptom_palpitations, symptom_syncope, \
            symptom_oedema, suspected_acs, exertional_syncope, new_onset_heart_failure, \
            ecg_done, ecg_findings, troponin_status, bnp_status, \
            known_coronary_artery_disease, previous_mi, heart_failure, valve_disease, \
            arrhythmia, hypertension, diabetes, current_medications, urgency, \
            supervising_consultant, requester_contact, notes) VALUES ($1, $2, '', '', \
            '', '', '', '', '', false, '', false, '', false, false, false, false, false, \
            false, false, '', '', '', false, false, false, false, false, false, false, \
            '', '', '', '', '') RETURNING id",
        )
        .bind(row0)
        .bind(row1)
        .fetch_one(&ctx.db)
        .await
        .unwrap();
        let row3: Uuid = sqlx::query_scalar(
            "INSERT INTO cardiology_request_grades (cardiology_request_id, \
            appropriateness_band, safety_band, triage_tier, target_timeframe, \
            recommendation, clinician_notes) VALUES ($1, '', '', '', '', '', '') \
            RETURNING id",
        )
        .bind(row2)
        .fetch_one(&ctx.db)
        .await
        .unwrap();

        let path = format!("/api/cardiology_requests/{row2}");
        let live = request.get(&path).await;
        assert_eq!(live.status_code(), 200);
        let body = live.json::<serde_json::Value>();
        assert!(body.get("deletedAt").is_none());

        request.delete(&path).await.assert_status_success();
        assert_eq!(request.get(&path).await.status_code(), 404);
        assert_eq!(request.delete(&path).await.status_code(), 404);
        let listed = request
            .get("/api/cardiology_requests")
            .await
            .json::<serde_json::Value>();
        assert!(!listed.to_string().contains(&row2.to_string()));
        let stale = request.patch(&path).json(&body).await;
        assert!(
            !stale.status_code().is_success(),
            "an update reached a deleted row"
        );

        let hidden: bool = sqlx::query_scalar(
            "SELECT deleted_at IS NOT NULL FROM cardiology_requests WHERE id = $1",
        )
        .bind(row2)
        .fetch_one(&ctx.db)
        .await
        .unwrap();
        assert!(hidden, "the row was removed, not marked");

        let hidden: bool = sqlx::query_scalar(
            "SELECT deleted_at IS NOT NULL FROM cardiology_request_grades WHERE id = $1",
        )
        .bind(row3)
        .fetch_one(&ctx.db)
        .await
        .unwrap();
        assert!(hidden, "the delete did not cascade");

        let unnarrowed: i64 = sqlx::query_scalar(
            "SELECT count(*) FROM pg_index i JOIN pg_class c ON c.oid = i.indrelid JOIN \
            pg_namespace n ON n.oid = c.relnamespace JOIN pg_attribute a ON a.attrelid = \
            i.indrelid AND a.attname = 'deleted_at' WHERE i.indisunique AND NOT \
            i.indisprimary AND i.indpred IS NULL AND n.nspname = current_schema()",
        )
        .fetch_one(&ctx.db)
        .await
        .unwrap();
        assert_eq!(unnarrowed, 0, "a deleted row can block its replacement");
    })
    .await;
}
