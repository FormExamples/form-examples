//! Every failed request answers RFC 9457 `application/problem+json`.

use architecture_decision_record::app::App;
use axa::{prelude::*, routes::AppRoutes};
use serde_json::Value;
use serial_test::serial;

/// Assert the problem shape, and hand back the body and its text.
macro_rules! problem {
    ($response:expr, $status:expr) => {{
        let response = $response;
        assert_eq!(response.status_code(), $status, "{}", response.text());
        assert_eq!(response.header("content-type"), "application/problem+json");
        let body: Value = response.json();
        assert_eq!(body["type"], "about:blank");
        assert_eq!(body["status"], $status);
        assert!(body["title"].is_string());
        (body, response.text())
    }};
}

#[tokio::test]
#[serial]
async fn every_failure_is_a_problem() {
    request::<App, _, _>(|request, _ctx| async move {
        // axa's own error, whose text reaches the client.
        let (body, _) = problem!(request.get("/api/adrs?cursor=forged").await, 422);
        assert!(body["detail"].is_string());

        // A route that does not exist, and a wrong method.
        problem!(request.get("/api/no-such-route").await, 404);
        problem!(request.delete("/api/adrs").await, 405);
    })
    .await;
}

async fn panics() -> Result<Response> {
    panic!("a handler fault");
}

async fn refuses() -> Result<Response> {
    bad_request("This text reaches the client, and is long enough to compress.")
}

/// A panic and a compressed error both pass through the standard middleware, so
/// it has to be in the test.
#[tokio::test]
#[serial]
async fn the_middleware_cannot_escape_it() {
    let mut ctx = boot_test::<App>().await.unwrap().app_context;
    let mut config = (*ctx.config).clone();
    config.http.compression = true;
    ctx.config = config.into();
    let routes = AppRoutes::with_default_routes().add_route(
        Routes::new()
            .add("/panics", get(panics))
            .add("/refuses", get(refuses)),
    );
    let router = routes.into_app(ctx.clone()).unwrap();
    let server = TestServer::new(router.into_make_service());

    let (_, text) = problem!(server.get("/panics").await, 500);
    assert!(!text.contains("a handler fault"));

    let response = server
        .get("/refuses")
        .add_header("accept-encoding", "gzip")
        .await;
    assert_eq!(response.status_code(), 400);
    assert_eq!(response.header("content-type"), "application/problem+json");
    assert_eq!(response.header("content-encoding"), "gzip");
}

/// A status outside the SQL CHECK list is refused before the database sees it:
/// this crate validates its enums itself and answers `400` saying which value.
/// The CHECK stays as the backstop, and the database refuses the same value.
#[tokio::test]
#[serial]
async fn a_value_outside_a_check_is_refused() {
    request::<App, _, _>(|request, ctx| async move {
        let pool = crate::db(&ctx);
        let author: (uuid::Uuid,) = sqlx::query_as(
            "INSERT INTO authors (name, email, role) VALUES ('Test', 'a@example.com', 'architect') RETURNING id",
        )
        .fetch_one(&pool)
        .await
        .unwrap();
        let organization: (uuid::Uuid,) =
            sqlx::query_as("INSERT INTO organizations (name) VALUES ('Acme') RETURNING id")
                .fetch_one(&pool)
                .await
                .unwrap();
        let adr = |status: &str| {
            serde_json::json!({
                "authorId": author.0,
                "organizationId": organization.0,
                "title": "Use PostgreSQL",
                "status": status
            })
        };
        let (body, _) = problem!(request.post("/api/adrs").json(&adr("provisional")).await, 400);
        assert!(body["detail"].as_str().unwrap().starts_with("status "));
        request.post("/api/adrs").json(&adr("pending")).await.assert_status_ok();

        let refused = sqlx::query("UPDATE authors SET role = 'not-a-listed-value'")
            .execute(&pool)
            .await
            .unwrap_err();
        let code = refused.as_database_error().and_then(|e| e.code()).unwrap();
        assert_eq!(code, "23514", "a CHECK violation");
    })
    .await;
}
