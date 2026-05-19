mod controllers;
mod engine;
mod views;

use std::collections::HashMap;
use std::sync::{Arc, Mutex};

use axum::{Extension, Router};
use tera::Tera;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

use crate::engine::types::ApplicationData;

/// Process-wide in-memory store: application id → ApplicationData.
pub type Store = Arc<Mutex<HashMap<uuid::Uuid, ApplicationData>>>;

#[tokio::main]
async fn main() {
    tracing_subscriber::registry()
        .with(tracing_subscriber::EnvFilter::new(
            std::env::var("RUST_LOG").unwrap_or_else(|_| "info".to_string()),
        ))
        .with(tracing_subscriber::fmt::layer())
        .init();

    // Determine template directory relative to the binary's manifest location.
    // In development `cargo run` sets CARGO_MANIFEST_DIR; fall back to cwd.
    let template_glob = std::env::var("CARGO_MANIFEST_DIR")
        .map(|d| format!("{d}/templates/**/*.tera"))
        .unwrap_or_else(|_| "templates/**/*.tera".to_string());

    let tera = Tera::new(&template_glob).expect("Failed to compile Tera templates");
    let tera = Arc::new(tera);

    let store: Store = Arc::new(Mutex::new(HashMap::new()));

    let app = Router::new()
        .merge(controllers::application::router())
        .layer(Extension(tera))
        .layer(Extension(store));

    let addr = "127.0.0.1:3000";
    tracing::info!("Listening on http://{addr}");
    let listener = tokio::net::TcpListener::bind(addr)
        .await
        .expect("Failed to bind address");
    axum::serve(listener, app).await.expect("Server error");
}
