use axum::debug_handler;
use loco_rs::prelude::*;

#[debug_handler]
async fn root() -> Result<Response> {
    let body = "agile-consulting-scorecard-for-hiring-help — Loco backend.\n\n\
       Endpoints:\n  \
       GET  /api/dashboard/scorecards\n  \
       GET  /api/scorecards/{id}\n  \
       GET  /api/stats\n  \
       POST /api/scorecards\n  \
       POST /api/grade\n  \
       POST /api/recommendations\n  \
       POST /api/pre-tender\n  \
       POST /api/diff\n  \
       POST /api/bulk-import\n";
    Ok(Response::builder()
        .header("Content-Type", "text/plain; charset=utf-8")
        .body(axum::body::Body::from(body))
        .map_err(Error::wrap)?
        .into_response())
}

pub fn routes() -> Routes {
    Routes::new().add("/", get(root))
}
