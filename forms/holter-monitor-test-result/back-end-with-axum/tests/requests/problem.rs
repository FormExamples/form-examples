//! Every failed request answers RFC 9457 `application/problem+json`.

use axa::{prelude::*, routes::AppRoutes};
use holter_monitor_test_result::app::App;
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
        let (body, _) = problem!(request.get("/api/clinicians?offset=100001").await, 400);
        assert!(body["detail"].is_string());

        // A route that does not exist, and a wrong method.
        problem!(request.get("/api/no-such-route").await, 404);
        problem!(request.delete("/api/openapi.yaml").await, 405);

        // A missing row.
        let id = "00000000-0000-4000-8000-000000000000";
        problem!(request.get(&format!("/api/clinicians/{id}")).await, 404);

        // An extractor's refusal says what was wrong, and quotes nothing.
        let (body, text) = problem!(request.get("/api/clinicians/not-a-uuid").await, 400);
        assert!(body["detail"].is_string());
        assert!(!text.contains("not-a-uuid"));
        problem!(
            request.post("/api/clinicians").json(&"not an object").await,
            422
        );
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
