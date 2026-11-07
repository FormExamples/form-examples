#![forbid(unsafe_code)]

use axa::testing::prelude::*;
use neurodiversity_adjustment_request_axum_crate::app::App;
use serde_json::Value;
use serial_test::serial;
use sqlx::PgPool;
use uuid::Uuid;

/// A request with blank answers, for `worker` and `manager`.
async fn insert_request(db: &PgPool, worker: Uuid, manager: Uuid) -> Uuid {
    sqlx::query_scalar(
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
    .bind(worker)
    .bind(manager)
    .fetch_one(db)
    .await
    .unwrap()
}

/// Each request is listed with its own grade, or none, and the list pages.
#[tokio::test]
#[serial]
async fn the_dashboard_pairs_each_request_with_its_own_grade() {
    request::<App, _, _>(|request, ctx| async move {
        let worker: Uuid = sqlx::query_scalar(
            "INSERT INTO workers (name, job_title, department, employment_type, \
            work_pattern, work_location) VALUES ('', '', '', '', '', '') RETURNING id",
        )
        .fetch_one(&ctx.db)
        .await
        .unwrap();
        let manager: Uuid = sqlx::query_scalar(
            "INSERT INTO managers (name, role, job_title, department) VALUES ('', '', '', \
            '') RETURNING id",
        )
        .fetch_one(&ctx.db)
        .await
        .unwrap();
        let graded = insert_request(&ctx.db, worker, manager).await;
        let ungraded = insert_request(&ctx.db, worker, manager).await;
        sqlx::query(
            "INSERT INTO neurodiversity_adjustment_request_grades \
            (neurodiversity_adjustment_request_id, eligibility_band, impact_band, \
            priority_tier, target_timeframe, recommendation, manager_notes) VALUES ($1, \
            'likely', '', '', '', '', '')",
        )
        .bind(graded)
        .execute(&ctx.db)
        .await
        .unwrap();

        let page = request.get("/api/dashboard").await;
        page.assert_status_ok();
        assert_eq!(page.header("x-total-count"), "2");
        let rows = page.json::<Vec<Value>>();
        assert_eq!(rows.len(), 2);
        for row in &rows {
            let id: Uuid = row["request"]["id"].as_str().unwrap().parse().unwrap();
            if id == graded {
                assert_eq!(row["grade"]["eligibilityBand"], "likely");
            } else {
                assert_eq!(id, ungraded);
                assert!(row["grade"].is_null(), "{row}");
            }
        }

        let page = request.get("/api/dashboard?limit=1").await;
        assert_eq!(page.header("x-total-count"), "2");
        assert_eq!(page.json::<Vec<Value>>().len(), 1);
    })
    .await;
}
