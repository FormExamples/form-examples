//! Single-page wizard controller for the medical-operation-note.
//!
//! Routes:
//!   GET  /operation-note              → render the 12-step wizard
//!   POST /operation-note/submit       → compute grade + render report
//!   GET  /operation-note/report.pdf   → text/plain stub PDF endpoint
//!
//! The wizard is rendered as one HTML page that includes all 12 step
//! partials via Tera `{% include %}`. HTMX boosts navigation; Alpine.js
//! handles client-side conditional fields and the live grade preview.

#![allow(clippy::unused_async)]
#![allow(clippy::missing_errors_doc)]

use axum::extract::Form;
use axum_extra::extract::Form as ExtraForm;
use loco_rs::prelude::*;
use serde::{Deserialize, Serialize};

use crate::engine::{self, ClavienDindo, OperationNote};

/// Raw HTML form payload. All fields default to empty/zero so the wizard
/// can be submitted with any subset of steps completed.
#[derive(Debug, Default, Deserialize, Serialize)]
#[serde(default, rename_all = "camelCase")]
pub struct WizardForm {
    #[serde(rename = "estimated_blood_loss_ml")]
    pub estimated_blood_loss_ml: Option<i32>,
    #[serde(rename = "prbc_units")]
    pub prbc_units: Option<i32>,
    #[serde(rename = "massive_haemorrhage_protocol_activated")]
    pub massive_haemorrhage_protocol_activated: Option<String>,
    #[serde(rename = "converted_to_open")]
    pub converted_to_open: Option<String>,
    #[serde(rename = "swab_count_final_agreed")]
    pub swab_count_final_agreed: Option<String>,
    #[serde(rename = "needle_count_final_agreed")]
    pub needle_count_final_agreed: Option<String>,
    #[serde(rename = "instrument_count_final_agreed")]
    pub instrument_count_final_agreed: Option<String>,
    #[serde(rename = "retained_foreign_body")]
    pub retained_foreign_body: Option<String>,
    #[serde(rename = "never_event_flagged")]
    pub never_event_flagged: Option<String>,
    #[serde(rename = "never_event_description")]
    pub never_event_description: Option<String>,
    #[serde(rename = "intra_operative_arrest")]
    pub intra_operative_arrest: Option<String>,
    #[serde(rename = "anaesthetic_event")]
    pub anaesthetic_event: Option<String>,
    #[serde(rename = "worst_clavien_dindo")]
    pub worst_clavien_dindo: Option<String>,
    #[serde(rename = "asa_physical_status")]
    pub asa_physical_status: Option<u8>,
    #[serde(rename = "recovery_destination")]
    pub recovery_destination: Option<String>,
    #[serde(rename = "planned_recovery_destination")]
    pub planned_recovery_destination: Option<String>,
}

fn yn(s: &Option<String>) -> bool {
    matches!(
        s.as_deref(),
        Some("yes") | Some("true") | Some("on") | Some("1")
    )
}

impl WizardForm {
    fn to_operation_note(&self) -> OperationNote {
        OperationNote {
            estimated_blood_loss_ml: self.estimated_blood_loss_ml,
            transfusion_prbc_units: self.prbc_units,
            massive_haemorrhage_protocol_activated: yn(&self.massive_haemorrhage_protocol_activated),
            converted_to_open: yn(&self.converted_to_open),
            swab_count_agreed: self
                .swab_count_final_agreed
                .as_deref()
                .map(|s| s == "yes")
                .unwrap_or(true),
            needle_count_agreed: self
                .needle_count_final_agreed
                .as_deref()
                .map(|s| s == "yes")
                .unwrap_or(true),
            instrument_count_agreed: self
                .instrument_count_final_agreed
                .as_deref()
                .map(|s| s == "yes")
                .unwrap_or(true),
            retained_foreign_body: yn(&self.retained_foreign_body),
            never_event_flagged: yn(&self.never_event_flagged),
            never_event_kind: self.never_event_description.clone().unwrap_or_default(),
            intra_operative_arrest: yn(&self.intra_operative_arrest),
            anaesthetic_event: self
                .anaesthetic_event
                .clone()
                .unwrap_or_else(|| "none".into()),
            worst_clavien_dindo: self
                .worst_clavien_dindo
                .as_deref()
                .and_then(ClavienDindo::from_str),
            asa_physical_status: self.asa_physical_status,
            recovery_destination: self.recovery_destination.clone().unwrap_or_default(),
            planned_recovery_destination: self
                .planned_recovery_destination
                .clone()
                .unwrap_or_default(),
        }
    }
}

#[debug_handler]
pub async fn show_wizard(
    ViewEngine(v): ViewEngine<TeraView>,
    State(_ctx): State<AppContext>,
) -> Result<Response> {
    format::render().view(&v, "operation_note/index.html", data!({}))
}

#[debug_handler]
pub async fn submit_wizard(
    ViewEngine(v): ViewEngine<TeraView>,
    State(_ctx): State<AppContext>,
    ExtraForm(form): ExtraForm<WizardForm>,
) -> Result<Response> {
    let note = form.to_operation_note();
    let grade = engine::grade(&note);
    format::render().view(
        &v,
        "operation_note/report.html",
        data!({ "grade": grade }),
    )
}

#[debug_handler]
pub async fn show_report(
    ViewEngine(v): ViewEngine<TeraView>,
    State(_ctx): State<AppContext>,
) -> Result<Response> {
    // Static demo report — real use loads the persisted note + grade.
    let note = OperationNote::default();
    let grade = engine::grade(&note);
    format::render().view(
        &v,
        "operation_note/report.html",
        data!({ "grade": grade }),
    )
}

/// Minimal "signed PDF" endpoint stub — returns a text/plain attestation
/// so the route is wired up. A production implementation would render a
/// PDF (printpdf, weasyprint, pdfmake-server, etc.) and sign it with the
/// surgeon's electronic signature.
#[debug_handler]
pub async fn download_pdf(
    State(_ctx): State<AppContext>,
    Form(_form): Form<WizardForm>,
) -> Result<Response> {
    format::render()
        .text("Signed PDF placeholder — see assets/views/operation_note/report.html")
}

pub fn routes() -> Routes {
    Routes::new()
        .prefix("operation-note")
        .add("/", get(show_wizard))
        .add("/submit", post(submit_wizard))
        .add("/report", get(show_report))
        .add("/report.pdf", post(download_pdf))
}
