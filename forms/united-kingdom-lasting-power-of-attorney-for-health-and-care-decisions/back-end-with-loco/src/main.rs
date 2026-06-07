//! LP1H server — axum + tera. Renders the wizard, exposes a JSON validity
//! endpoint, and serves the base Tera template with HTMX + Alpine.js boost.

// Always start with high quality coding conventions.
#![forbid(unsafe_code)]
#![deny(missing_docs)]
#![warn(clippy::clippy::pedantic)]

// When we build for MUSL static, use faster memory allocator.
#[cfg(target_env = "musl")]
#[global_allocator]
static GLOBAL: mimalloc::MiMalloc = mimalloc::MiMalloc;

use std::net::SocketAddr;
use std::sync::Arc;

use axum::{
    extract::State,
    http::StatusCode,
    response::{Html, IntoResponse, Json},
    routing::{get, post},
    Router,
};
use tera::{Context, Tera};
use tracing::info;

use uk_lpa_health_care_decisions::{
    calculate_lpa_validity, ENGINE_VERSION, LpaApplication, LpaValidityResult,
};

#[derive(Clone)]
struct AppState {
    templates: Arc<Tera>,
}

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();

    let templates = match Tera::new("templates/**/*.tera") {
        Ok(t) => t,
        Err(e) => {
            eprintln!("Tera load error: {e}");
            std::process::exit(1);
        }
    };

    let state = AppState {
        templates: Arc::new(templates),
    };

    let app = Router::new()
        .route("/", get(index_handler))
        .route("/api/health", get(health_handler))
        .route("/api/lpa/validate", post(validate_handler))
        .with_state(state);

    let addr = SocketAddr::from(([0, 0, 0, 0], 5150));
    info!("LP1H server listening on http://{addr}");

    let listener = tokio::net::TcpListener::bind(addr).await.expect("bind");
    axum::serve(listener, app).await.expect("serve");
}

async fn index_handler(State(state): State<AppState>) -> impl IntoResponse {
    let mut ctx = Context::new();
    ctx.insert("engine_version", ENGINE_VERSION);
    ctx.insert(
        "form_title",
        "Lasting Power of Attorney for Health and Welfare (LP1H)",
    );
    match state.templates.render("base.html.tera", &ctx) {
        Ok(rendered) => (StatusCode::OK, Html(rendered)).into_response(),
        Err(e) => (
            StatusCode::INTERNAL_SERVER_ERROR,
            format!("template error: {e}"),
        )
            .into_response(),
    }
}

async fn health_handler() -> Json<serde_json::Value> {
    Json(serde_json::json!({
        "status": "ok",
        "engineVersion": ENGINE_VERSION,
    }))
}

async fn validate_handler(Json(app): Json<LpaApplication>) -> Json<LpaValidityResult> {
    let result = calculate_lpa_validity(&app);
    Json(result)
}
