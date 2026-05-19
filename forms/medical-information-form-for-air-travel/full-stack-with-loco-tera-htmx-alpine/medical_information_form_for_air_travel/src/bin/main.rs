//! MEDIF server binary entrypoint.
//!
//! Minimal axum entrypoint. Migrates to Loco 0.16 in Phase 1 of the plan.

use medical_information_form_for_air_travel::app;

#[tokio::main]
async fn main() {
    let router = app::router();
    let addr = std::net::SocketAddr::from(([127, 0, 0, 1], 5150));
    let listener = match tokio::net::TcpListener::bind(addr).await {
        Ok(l) => l,
        Err(e) => {
            eprintln!("failed to bind {addr}: {e}");
            return;
        }
    };
    println!("MEDIF server listening on http://{addr}");
    if let Err(e) = axum::serve(listener, router).await {
        eprintln!("server error: {e}");
    }
}
