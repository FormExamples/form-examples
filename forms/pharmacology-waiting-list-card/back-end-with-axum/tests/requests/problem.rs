//! Every failed request answers RFC 9457 `application/problem+json`.

use axa::{prelude::*, routes::AppRoutes};
use pharmacology_waiting_list_card::{app::App, support::problem};
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
        let (body, _) = problem!(request.get("/api/patients?offset=100001").await, 400);
        assert!(body["detail"].is_string());

        // A route that does not exist, and a wrong method.
        problem!(request.get("/api/no-such-route").await, 404);
        problem!(request.delete("/api/openapi.yaml").await, 405);

        // A missing row.
        let id = "00000000-0000-4000-8000-000000000000";
        problem!(request.get(&format!("/api/patients/{id}")).await, 404);

        // Extractor refusals quote the input, so nothing of it comes back.
        let (body, text) = problem!(request.get("/api/patients/not-a-uuid").await, 400);
        assert_eq!(body.get("detail"), None);
        assert!(!text.contains("not-a-uuid"));
        problem!(
            request.post("/api/patients").json(&"not an object").await,
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

/// A panic is answered outside the first pass, and an error reaches the second
/// pass compressed, so the standard middleware has to be in the test.
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
    let router = problem::apply(routes, &ctx).unwrap();
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
