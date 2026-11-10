use architecture_decision_record::{app::App, models::architecture_decision_records::Model};
use axa_test::prelude::*;
use serial_test::serial;
use uuid::Uuid;

#[tokio::test]
#[serial]
async fn delete_hides_the_record_and_keeps_it() {
    request::<App, _, _>(|request, ctx| async move {
        let author: Uuid =
            sqlx::query_scalar("INSERT INTO authors (name) VALUES ('') RETURNING id")
                .fetch_one(&ctx.db)
                .await
                .unwrap();
        let organization: Uuid =
            sqlx::query_scalar("INSERT INTO organizations (name) VALUES ('') RETURNING id")
                .fetch_one(&ctx.db)
                .await
                .unwrap();
        let id: Uuid = sqlx::query_scalar(
            "INSERT INTO architecture_decision_records (author_id, organization_id, slug, title, \
            number) VALUES ($1, $2, 'kept', 'Kept', 7) RETURNING id",
        )
        .bind(author)
        .bind(organization)
        .fetch_one(&ctx.db)
        .await
        .unwrap();
        assert_eq!(request.get("/api/adrs/kept").await.status_code(), 200);

        Model::delete(&ctx.db, id).await.unwrap();

        assert_eq!(request.get("/api/adrs/kept").await.status_code(), 404);
        let listed = request.get("/api/adrs").await.json::<serde_json::Value>();
        assert!(!listed.to_string().contains(&id.to_string()));
        let hidden: bool = sqlx::query_scalar(
            "SELECT deleted_at IS NOT NULL FROM architecture_decision_records WHERE id = $1",
        )
        .bind(id)
        .fetch_one(&ctx.db)
        .await
        .unwrap();
        assert!(hidden, "the row was removed, not marked");

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
