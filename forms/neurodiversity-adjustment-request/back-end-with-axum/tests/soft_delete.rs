#![forbid(unsafe_code)]

use axa_test::prelude::*;
use neurodiversity_adjustment_request_axum_crate::app::App;
use serial_test::serial;
use uuid::Uuid;

#[tokio::test]
#[serial]
async fn delete_hides_the_row_and_keeps_it() {
    request::<App, _, _>(|request, ctx| async move {
        let row0: Uuid = sqlx::query_scalar(
            "INSERT INTO workers (name, job_title, department, employment_type, \
            work_pattern, work_location) VALUES ('', '', '', '', '', '') RETURNING id",
        )
        .fetch_one(&ctx.db)
        .await
        .unwrap();
        let row1: Uuid = sqlx::query_scalar(
            "INSERT INTO managers (name, role, job_title, department) VALUES ('', '', '', \
            '') RETURNING id",
        )
        .fetch_one(&ctx.db)
        .await
        .unwrap();
        let row2: Uuid = sqlx::query_scalar(
            "INSERT INTO neurodiversity_adjustment_requests (worker_id, manager_id, \
            status, requested_by, condition_adhd, condition_autism, condition_dyslexia, \
            condition_dyspraxia, condition_dyscalculia, condition_tourettes, \
            condition_other, condition_other_detail, diagnosis_status, \
            considers_disability, substantial_long_term_impact, disclosure_consent, \
            difficulty_concentration, difficulty_written_communication, \
            difficulty_organisation_time, difficulty_sensory_overload, \
            difficulty_balance_coordination, difficulty_social_communication, \
            difficulty_memory, difficulty_burnout_wellbeing, tasks_situations_affected, \
            worker_strengths, adjustment_working_environment, \
            adjustment_equipment_technology, adjustment_working_arrangements, \
            adjustment_communication, adjustment_support_mentoring, \
            adjustment_recruitment_process, adjustment_policy_dress, adjustment_other, \
            adjustments_requested_detail, supporting_evidence_type, \
            occupational_health_involved, access_to_work_involved, current_impact, \
            at_risk_of_absence, urgency, notes) VALUES ($1, $2, '', '', false, false, \
            false, false, false, false, false, '', '', '', false, false, false, false, \
            false, false, false, false, false, false, '', '', false, false, false, \
            false, false, false, false, false, '', '', false, false, '', false, '', '') \
            RETURNING id",
        )
        .bind(row0)
        .bind(row1)
        .fetch_one(&ctx.db)
        .await
        .unwrap();
        let row3: Uuid = sqlx::query_scalar(
            "INSERT INTO neurodiversity_adjustment_request_grades \
            (neurodiversity_adjustment_request_id, eligibility_band, impact_band, \
            priority_tier, target_timeframe, recommendation, manager_notes) VALUES ($1, \
            '', '', '', '', '', '') RETURNING id",
        )
        .bind(row2)
        .fetch_one(&ctx.db)
        .await
        .unwrap();

        let path = format!("/api/neurodiversity-adjustment-requests/{row2}");
        let live = request.get(&path).await;
        assert_eq!(live.status_code(), 200);
        let body = live.json::<serde_json::Value>();
        assert!(body.get("deletedAt").is_none());

        request.delete(&path).await.assert_status_success();
        assert_eq!(request.get(&path).await.status_code(), 404);
        assert_eq!(request.delete(&path).await.status_code(), 404);
        let listed = request.get("/api/neurodiversity-adjustment-requests").await.json::<serde_json::Value>();
        assert!(!listed.to_string().contains(&row2.to_string()));
        let stale = request.patch(&path).json(&body).await;
        assert!(!stale.status_code().is_success(), "an update reached a deleted row");

        let hidden: bool = sqlx::query_scalar(
            "SELECT deleted_at IS NOT NULL FROM neurodiversity_adjustment_requests WHERE id = $1",
        )
        .bind(row2)
        .fetch_one(&ctx.db)
        .await
        .unwrap();
        assert!(hidden, "the row was removed, not marked");

        let hidden: bool = sqlx::query_scalar(
            "SELECT deleted_at IS NOT NULL FROM neurodiversity_adjustment_request_grades WHERE id = $1",
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
