use axa::testing::prelude::*;
use hospital_dashboard_metrics::app::App;
use serial_test::serial;
use uuid::Uuid;

#[tokio::test]
#[serial]
async fn delete_hides_the_row_and_keeps_it() {
    request::<App, _, _>(|request, ctx| async move {
        let row0: Uuid = sqlx::query_scalar(
            "INSERT INTO hospital_dashboard_metrics DEFAULT VALUES RETURNING id",
        )
        .fetch_one(&ctx.db)
        .await
        .unwrap();
        let row1: Uuid = sqlx::query_scalar(
            "INSERT INTO hospital_dashboard_metric_values (metric_code, category_number, \
            hospital_dashboard_metrics_id) VALUES ('', 0, $1) RETURNING id",
        )
        .bind(row0)
        .fetch_one(&ctx.db)
        .await
        .unwrap();

        let path = format!("/api/hospital_dashboard_metrics/{row0}");
        let live = request.get(&path).await;
        assert_eq!(live.status_code(), 200);
        let body = live.json::<serde_json::Value>();
        assert!(body.get("deletedAt").is_none());

        request.delete(&path).await.assert_status_success();
        assert_eq!(request.get(&path).await.status_code(), 404);
        assert_eq!(request.delete(&path).await.status_code(), 404);
        let listed = request
            .get("/api/hospital_dashboard_metrics")
            .await
            .json::<serde_json::Value>();
        assert!(!listed.to_string().contains(&row0.to_string()));
        let stale = request.patch(&path).json(&body).await;
        assert!(
            !stale.status_code().is_success(),
            "an update reached a deleted row"
        );

        let hidden: bool = sqlx::query_scalar(
            "SELECT deleted_at IS NOT NULL FROM hospital_dashboard_metrics WHERE id = $1",
        )
        .bind(row0)
        .fetch_one(&ctx.db)
        .await
        .unwrap();
        assert!(hidden, "the row was removed, not marked");

        let hidden: bool = sqlx::query_scalar(
            "SELECT deleted_at IS NOT NULL FROM hospital_dashboard_metric_values WHERE id = $1",
        )
        .bind(row1)
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
