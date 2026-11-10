use axa_test::prelude::*;
use pre_operative_assessment_by_patient::app::App;
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
            "INSERT INTO pre_operative_assessment_by_patients (patient_id, \
            cancer_history, cancer_history_details, mrsa_history, \
            recent_hospital_or_care_home_admission, palpitations_or_blackouts, \
            heart_or_artery_surgery, swollen_ankles, snoring, snoring_loud, \
            daytime_sleepiness, observed_apnoea_episodes, urinary_symptoms, \
            urinary_catheter_history, prostate_problems, personal_vte_history, \
            family_vte_history, blood_transfusion_history, joint_or_arthritis_problems, \
            back_or_neck_problems, skin_conditions, pressure_sore_risk, bowel_problems, \
            food_intolerances, food_intolerances_details, blood_donor, body_piercings, \
            hearing_problems, vision_problems, balance_issues, contraceptive_or_hrt_use, \
            last_menstrual_period, head_injury_requiring_hospitalisation, \
            memory_concerns, dementia_diagnosis, depression_or_anxiety_history, \
            depression_anxiety_impacts_daily_life, depression_anxiety_seen_doctor, \
            learning_difficulties) VALUES ($1, '', '', '', '', '', '', '', '', '', '', \
            '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', \
            '', '', '', '', '', '', '', '', '') RETURNING id",
        )
        .bind(row0)
        .fetch_one(&ctx.db)
        .await
        .unwrap();
        let row2: Uuid = sqlx::query_scalar(
            "INSERT INTO grades (pre_operative_assessment_by_patient_id) VALUES ($1) \
            RETURNING id",
        )
        .bind(row1)
        .fetch_one(&ctx.db)
        .await
        .unwrap();
        let row3: Uuid = sqlx::query_scalar(
            "INSERT INTO grading_fired_rules (grade_id, rule_id, instrument) VALUES ($1, \
            '', 'asa') RETURNING id",
        )
        .bind(row2)
        .fetch_one(&ctx.db)
        .await
        .unwrap();

        let path = format!("/api/grades/{row2}");
        let live = request.get(&path).await;
        assert_eq!(live.status_code(), 200);
        let body = live.json::<serde_json::Value>();
        assert!(body.get("deletedAt").is_none());

        request.delete(&path).await.assert_status_success();
        assert_eq!(request.get(&path).await.status_code(), 404);
        assert_eq!(request.delete(&path).await.status_code(), 404);
        let listed = request.get("/api/grades").await.json::<serde_json::Value>();
        assert!(!listed.to_string().contains(&row2.to_string()));
        let stale = request.patch(&path).json(&body).await;
        assert!(
            !stale.status_code().is_success(),
            "an update reached a deleted row"
        );

        let hidden: bool =
            sqlx::query_scalar("SELECT deleted_at IS NOT NULL FROM grades WHERE id = $1")
                .bind(row2)
                .fetch_one(&ctx.db)
                .await
                .unwrap();
        assert!(hidden, "the row was removed, not marked");

        let hidden: bool = sqlx::query_scalar(
            "SELECT deleted_at IS NOT NULL FROM grading_fired_rules WHERE id = $1",
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
