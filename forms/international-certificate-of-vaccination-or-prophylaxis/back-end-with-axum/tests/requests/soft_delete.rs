use axa_test::prelude::*;
use international_certificate_of_vaccination_or_prophylaxis::app::App;
use serial_test::serial;
use uuid::Uuid;

#[tokio::test]
#[serial]
async fn delete_hides_the_row_and_keeps_it() {
    request::<App, _, _>(|request, ctx| async move {
        let row0: Uuid = sqlx::query_scalar(
            "INSERT INTO clinicians DEFAULT VALUES RETURNING id",
        )
        .fetch_one(&ctx.db)
        .await
        .unwrap();
        let row1: Uuid = sqlx::query_scalar(
            "INSERT INTO patients DEFAULT VALUES RETURNING id",
        )
        .fetch_one(&ctx.db)
        .await
        .unwrap();
        let row2: Uuid = sqlx::query_scalar(
            "INSERT INTO centers DEFAULT VALUES RETURNING id",
        )
        .fetch_one(&ctx.db)
        .await
        .unwrap();
        let row3: Uuid = sqlx::query_scalar(
            "INSERT INTO international_certificate_of_vaccination_or_prophylaxes \
            (patient_id, clinician_id, center_id) VALUES ($1, $2, $3) RETURNING id",
        )
        .bind(row1)
        .bind(row0)
        .bind(row2)
        .fetch_one(&ctx.db)
        .await
        .unwrap();

        let path = format!("/api/clinicians/{row0}");
        let live = request.get(&path).await;
        assert_eq!(live.status_code(), 200);
        let body = live.json::<serde_json::Value>();
        assert!(body.get("deletedAt").is_none());

        request.delete(&path).await.assert_status_success();
        assert_eq!(request.get(&path).await.status_code(), 404);
        assert_eq!(request.delete(&path).await.status_code(), 404);
        let listed = request.get("/api/clinicians").await.json::<serde_json::Value>();
        assert!(!listed.to_string().contains(&row0.to_string()));
        let stale = request.patch(&path).json(&body).await;
        assert!(!stale.status_code().is_success(), "an update reached a deleted row");

        let hidden: bool = sqlx::query_scalar(
            "SELECT deleted_at IS NOT NULL FROM clinicians WHERE id = $1",
        )
        .bind(row0)
        .fetch_one(&ctx.db)
        .await
        .unwrap();
        assert!(hidden, "the row was removed, not marked");

        let hidden: bool = sqlx::query_scalar(
            "SELECT deleted_at IS NOT NULL FROM international_certificate_of_vaccination_or_prophylaxes WHERE id = $1",
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
