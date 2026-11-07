#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::pet_scan_test_results::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub patient_id: Uuid,
    pub clinician_id: Uuid,
    pub originating_request_reference: String,
    pub scan_type: String,
    pub report_status: String,
    pub performed_date: Option<Date>,
    pub reported_date: Option<Date>,
    pub clinical_history: String,
    pub blood_glucose_mmol_l: Option<f64>,
    pub injected_activity_mbq: Option<f64>,
    pub examination_adequacy: String,
    pub findings_narrative: String,
    pub hypermetabolic_lesion: bool,
    pub nodal_uptake: bool,
    pub distant_metastasis: bool,
    pub no_abnormal_uptake: bool,
    pub physiological_uptake_only: bool,
    pub incidental_finding: bool,
    pub suv_max: Option<f64>,
    pub largest_lesion_size_mm: Option<f64>,
    pub comparison_with_previous: String,
    pub treatment_response: String,
    pub impression: String,
    pub reporting_category: String,
    pub recommended_follow_up: String,
    pub critical_result_communicated: bool,
    pub reported_to: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO pet_scan_test_results (patient_id, clinician_id, \
            originating_request_reference, scan_type, report_status, performed_date, \
            reported_date, clinical_history, blood_glucose_mmol_l, \
            injected_activity_mbq, examination_adequacy, findings_narrative, \
            hypermetabolic_lesion, nodal_uptake, distant_metastasis, no_abnormal_uptake, \
            physiological_uptake_only, incidental_finding, suv_max, \
            largest_lesion_size_mm, comparison_with_previous, treatment_response, \
            impression, reporting_category, recommended_follow_up, \
            critical_result_communicated, reported_to) VALUES ($1, $2, $3, $4, $5, $6, \
            $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, \
            $23, $24, $25, $26, $27) RETURNING *",
        )
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.originating_request_reference)
        .bind(&self.scan_type)
        .bind(&self.report_status)
        .bind(self.performed_date)
        .bind(self.reported_date)
        .bind(&self.clinical_history)
        .bind(self.blood_glucose_mmol_l)
        .bind(self.injected_activity_mbq)
        .bind(&self.examination_adequacy)
        .bind(&self.findings_narrative)
        .bind(self.hypermetabolic_lesion)
        .bind(self.nodal_uptake)
        .bind(self.distant_metastasis)
        .bind(self.no_abnormal_uptake)
        .bind(self.physiological_uptake_only)
        .bind(self.incidental_finding)
        .bind(self.suv_max)
        .bind(self.largest_lesion_size_mm)
        .bind(&self.comparison_with_previous)
        .bind(&self.treatment_response)
        .bind(&self.impression)
        .bind(&self.reporting_category)
        .bind(&self.recommended_follow_up)
        .bind(self.critical_result_communicated)
        .bind(&self.reported_to)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE pet_scan_test_results SET patient_id = $2, clinician_id = $3, \
            originating_request_reference = $4, scan_type = $5, report_status = $6, \
            performed_date = $7, reported_date = $8, clinical_history = $9, \
            blood_glucose_mmol_l = $10, injected_activity_mbq = $11, \
            examination_adequacy = $12, findings_narrative = $13, hypermetabolic_lesion \
            = $14, nodal_uptake = $15, distant_metastasis = $16, no_abnormal_uptake = \
            $17, physiological_uptake_only = $18, incidental_finding = $19, suv_max = \
            $20, largest_lesion_size_mm = $21, comparison_with_previous = $22, \
            treatment_response = $23, impression = $24, reporting_category = $25, \
            recommended_follow_up = $26, critical_result_communicated = $27, reported_to \
            = $28, updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.originating_request_reference)
        .bind(&self.scan_type)
        .bind(&self.report_status)
        .bind(self.performed_date)
        .bind(self.reported_date)
        .bind(&self.clinical_history)
        .bind(self.blood_glucose_mmol_l)
        .bind(self.injected_activity_mbq)
        .bind(&self.examination_adequacy)
        .bind(&self.findings_narrative)
        .bind(self.hypermetabolic_lesion)
        .bind(self.nodal_uptake)
        .bind(self.distant_metastasis)
        .bind(self.no_abnormal_uptake)
        .bind(self.physiological_uptake_only)
        .bind(self.incidental_finding)
        .bind(self.suv_max)
        .bind(self.largest_lesion_size_mm)
        .bind(&self.comparison_with_previous)
        .bind(&self.treatment_response)
        .bind(&self.impression)
        .bind(&self.reporting_category)
        .bind(&self.recommended_follow_up)
        .bind(self.critical_result_communicated)
        .bind(&self.reported_to)
        .fetch_optional(db)
        .await
    }
}

async fn load_item(ctx: &AppContext, id: Uuid) -> Result<Model> {
    let item = Model::find_by_id(&db(ctx), id).await?;
    item.ok_or_else(|| Error::NotFound)
}

#[debug_handler]
pub async fn list(
    State(ctx): State<AppContext>,
    OriginalUri(uri): OriginalUri,
) -> Result<Response> {
    let page = cursor_page(&ctx, &uri)?;
    let rows = Model::page(&db(&ctx), &page).await?;
    Ok(page.respond(rows))
}

#[debug_handler]
pub async fn add(State(ctx): State<AppContext>, Json(params): Json<Params>) -> Result<Response> {
    let item = params.insert(&db(&ctx)).await?;
    format::json(item)
}

#[debug_handler]
pub async fn update(
    Path(id): Path<Uuid>,
    State(ctx): State<AppContext>,
    Json(params): Json<Params>,
) -> Result<Response> {
    let item = params.update(&db(&ctx), id).await?.ok_or(Error::NotFound)?;
    format::json(item)
}

#[debug_handler]
pub async fn remove(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    load_item(&ctx, id).await?;
    Model::delete(&db(&ctx), id).await?;
    format::empty()
}

#[debug_handler]
pub async fn get_one(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    format::json(load_item(&ctx, id).await?)
}

pub fn routes() -> Routes {
    Routes::new()
        .prefix("api/pet_scan_test_results/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
