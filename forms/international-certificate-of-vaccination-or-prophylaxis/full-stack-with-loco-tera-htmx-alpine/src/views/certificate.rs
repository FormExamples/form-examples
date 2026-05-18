use serde::Serialize;
use uuid::Uuid;

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct CertificateView {
    pub id: Uuid,
    pub primary_disease: String,
    pub entries: u8,
    pub overall_valid: bool,
}

pub fn build_certificate_context(id: Uuid) -> tera::Context {
    let mut ctx = tera::Context::new();
    ctx.insert("id", &id);
    ctx
}
