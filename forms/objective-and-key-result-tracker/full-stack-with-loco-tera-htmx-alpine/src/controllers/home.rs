use loco_rs::prelude::*;

async fn index() -> Result<Response> {
    format::text("OKR Tracker — Loco scaffold")
}

pub fn routes() -> Routes {
    Routes::new().add("/", get(index))
}
