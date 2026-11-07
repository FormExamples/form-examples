use axa::testing::prelude::*;
use medical_device_assessment::app::App;
use serial_test::serial;
use uuid::Uuid;

#[tokio::test]
#[serial]
async fn delete_hides_the_row_and_keeps_it() {
    request::<App, _, _>(|request, ctx| async move {
        let row0: Uuid = sqlx::query_scalar(
            "INSERT INTO manufacturers (name) VALUES ('') RETURNING id",
        )
        .fetch_one(&ctx.db)
        .await
        .unwrap();
        let row1: Uuid = sqlx::query_scalar(
            "INSERT INTO assessors (name) VALUES ('') RETURNING id",
        )
        .fetch_one(&ctx.db)
        .await
        .unwrap();
        let row2: Uuid = sqlx::query_scalar(
            "INSERT INTO medical_device_assessments (manufacturer_id, assessor_id) VALUES \
            ($1, $2) RETURNING id",
        )
        .bind(row0)
        .bind(row1)
        .fetch_one(&ctx.db)
        .await
        .unwrap();
        let row3: Uuid = sqlx::query_scalar(
            "INSERT INTO medical_device_assessment_grades (graded_at, \
            medical_device_assessment_id) VALUES (now(), $1) RETURNING id",
        )
        .bind(row2)
        .fetch_one(&ctx.db)
        .await
        .unwrap();
        let row4: Uuid = sqlx::query_scalar(
            "INSERT INTO medical_device_assessment_grade_rules (rule_id, annex_viii_rule, \
            grade_id) VALUES ('', 1, $1) RETURNING id",
        )
        .bind(row3)
        .fetch_one(&ctx.db)
        .await
        .unwrap();

        let path = format!("/api/medical_device_assessment_grades/{row3}");
        let live = request.get(&path).await;
        assert_eq!(live.status_code(), 200);
        let body = live.json::<serde_json::Value>();
        assert!(body.get("deletedAt").is_none());

        request.delete(&path).await.assert_status_success();
        assert_eq!(request.get(&path).await.status_code(), 404);
        assert_eq!(request.delete(&path).await.status_code(), 404);
        let listed = request.get("/api/medical_device_assessment_grades").await.json::<serde_json::Value>();
        assert!(!listed.to_string().contains(&row3.to_string()));
        let stale = request.patch(&path).json(&body).await;
        assert!(!stale.status_code().is_success(), "an update reached a deleted row");

        let hidden: bool = sqlx::query_scalar(
            "SELECT deleted_at IS NOT NULL FROM medical_device_assessment_grades WHERE id = $1",
        )
        .bind(row3)
        .fetch_one(&ctx.db)
        .await
        .unwrap();
        assert!(hidden, "the row was removed, not marked");

        let hidden: bool = sqlx::query_scalar(
            "SELECT deleted_at IS NOT NULL FROM medical_device_assessment_grade_rules WHERE id = $1",
        )
        .bind(row4)
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
