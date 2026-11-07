#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::lumbar_puncture_test_results::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub patient_id: Uuid,
    pub clinician_id: Uuid,
    pub originating_request_reference: String,
    pub report_status: String,
    pub performed_date: Option<Date>,
    pub reported_date: Option<Date>,
    pub clinical_history: String,
    pub opening_pressure_cmh2o: Option<f64>,
    pub csf_appearance: String,
    pub csf_white_cell_count: Option<f64>,
    pub csf_red_cell_count: Option<f64>,
    pub csf_protein_g_l: Option<f64>,
    pub csf_glucose_mmol_l: Option<f64>,
    pub csf_serum_glucose_ratio: Option<f64>,
    pub csf_lactate_mmol_l: Option<f64>,
    pub gram_stain_result: String,
    pub culture_result: String,
    pub pcr_result: String,
    pub oligoclonal_bands: String,
    pub xanthochromia: String,
    pub raised_protein: bool,
    pub pleocytosis: bool,
    pub low_glucose: bool,
    pub bacterial_meningitis_pattern: bool,
    pub viral_pattern: bool,
    pub subarachnoid_haemorrhage_suggested: bool,
    pub normal_csf: bool,
    pub findings_narrative: String,
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
            "INSERT INTO lumbar_puncture_test_results (patient_id, clinician_id, \
            originating_request_reference, report_status, performed_date, reported_date, \
            clinical_history, opening_pressure_cmh2o, csf_appearance, \
            csf_white_cell_count, csf_red_cell_count, csf_protein_g_l, \
            csf_glucose_mmol_l, csf_serum_glucose_ratio, csf_lactate_mmol_l, \
            gram_stain_result, culture_result, pcr_result, oligoclonal_bands, \
            xanthochromia, raised_protein, pleocytosis, low_glucose, \
            bacterial_meningitis_pattern, viral_pattern, \
            subarachnoid_haemorrhage_suggested, normal_csf, findings_narrative, \
            impression, reporting_category, recommended_follow_up, \
            critical_result_communicated, reported_to) VALUES ($1, $2, $3, $4, $5, $6, \
            $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, \
            $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33) RETURNING *",
        )
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.originating_request_reference)
        .bind(&self.report_status)
        .bind(self.performed_date)
        .bind(self.reported_date)
        .bind(&self.clinical_history)
        .bind(self.opening_pressure_cmh2o)
        .bind(&self.csf_appearance)
        .bind(self.csf_white_cell_count)
        .bind(self.csf_red_cell_count)
        .bind(self.csf_protein_g_l)
        .bind(self.csf_glucose_mmol_l)
        .bind(self.csf_serum_glucose_ratio)
        .bind(self.csf_lactate_mmol_l)
        .bind(&self.gram_stain_result)
        .bind(&self.culture_result)
        .bind(&self.pcr_result)
        .bind(&self.oligoclonal_bands)
        .bind(&self.xanthochromia)
        .bind(self.raised_protein)
        .bind(self.pleocytosis)
        .bind(self.low_glucose)
        .bind(self.bacterial_meningitis_pattern)
        .bind(self.viral_pattern)
        .bind(self.subarachnoid_haemorrhage_suggested)
        .bind(self.normal_csf)
        .bind(&self.findings_narrative)
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
            "UPDATE lumbar_puncture_test_results SET patient_id = $2, clinician_id = $3, \
            originating_request_reference = $4, report_status = $5, performed_date = $6, \
            reported_date = $7, clinical_history = $8, opening_pressure_cmh2o = $9, \
            csf_appearance = $10, csf_white_cell_count = $11, csf_red_cell_count = $12, \
            csf_protein_g_l = $13, csf_glucose_mmol_l = $14, csf_serum_glucose_ratio = \
            $15, csf_lactate_mmol_l = $16, gram_stain_result = $17, culture_result = \
            $18, pcr_result = $19, oligoclonal_bands = $20, xanthochromia = $21, \
            raised_protein = $22, pleocytosis = $23, low_glucose = $24, \
            bacterial_meningitis_pattern = $25, viral_pattern = $26, \
            subarachnoid_haemorrhage_suggested = $27, normal_csf = $28, \
            findings_narrative = $29, impression = $30, reporting_category = $31, \
            recommended_follow_up = $32, critical_result_communicated = $33, reported_to \
            = $34, updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.originating_request_reference)
        .bind(&self.report_status)
        .bind(self.performed_date)
        .bind(self.reported_date)
        .bind(&self.clinical_history)
        .bind(self.opening_pressure_cmh2o)
        .bind(&self.csf_appearance)
        .bind(self.csf_white_cell_count)
        .bind(self.csf_red_cell_count)
        .bind(self.csf_protein_g_l)
        .bind(self.csf_glucose_mmol_l)
        .bind(self.csf_serum_glucose_ratio)
        .bind(self.csf_lactate_mmol_l)
        .bind(&self.gram_stain_result)
        .bind(&self.culture_result)
        .bind(&self.pcr_result)
        .bind(&self.oligoclonal_bands)
        .bind(&self.xanthochromia)
        .bind(self.raised_protein)
        .bind(self.pleocytosis)
        .bind(self.low_glucose)
        .bind(self.bacterial_meningitis_pattern)
        .bind(self.viral_pattern)
        .bind(self.subarachnoid_haemorrhage_suggested)
        .bind(self.normal_csf)
        .bind(&self.findings_narrative)
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
    Query(params): Query<PageParams>,
) -> Result<Response> {
    let page = params.resolve(PAGE_LIMITS)?;
    let (rows, total) = Model::page(&db(&ctx), page).await?;
    Ok(page.respond(total, rows))
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
        .prefix("api/lumbar_puncture_test_results/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
