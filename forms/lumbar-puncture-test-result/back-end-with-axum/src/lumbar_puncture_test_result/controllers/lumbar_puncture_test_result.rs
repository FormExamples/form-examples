#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::lumbar_puncture_test_results::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub deleted_at: Option<DateTimeWithTimeZone>,
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
            "INSERT INTO lumbar_puncture_test_results (deleted_at, patient_id, clinician_id, \
            originating_request_reference, report_status, performed_date, reported_date, \
            clinical_history, opening_pressure_cmh2o, csf_appearance, csf_white_cell_count, \
            csf_red_cell_count, csf_protein_g_l, csf_glucose_mmol_l, csf_serum_glucose_ratio, \
            csf_lactate_mmol_l, gram_stain_result, culture_result, pcr_result, \
            oligoclonal_bands, xanthochromia, raised_protein, pleocytosis, low_glucose, \
            bacterial_meningitis_pattern, viral_pattern, subarachnoid_haemorrhage_suggested, \
            normal_csf, findings_narrative, impression, reporting_category, \
            recommended_follow_up, critical_result_communicated, reported_to) VALUES ($1, $2, \
            $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, \
            $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34) \
            RETURNING *",
        )
        .bind(self.deleted_at)
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
            "UPDATE lumbar_puncture_test_results SET deleted_at = $2, patient_id = $3, \
            clinician_id = $4, originating_request_reference = $5, report_status = $6, \
            performed_date = $7, reported_date = $8, clinical_history = $9, \
            opening_pressure_cmh2o = $10, csf_appearance = $11, csf_white_cell_count = $12, \
            csf_red_cell_count = $13, csf_protein_g_l = $14, csf_glucose_mmol_l = $15, \
            csf_serum_glucose_ratio = $16, csf_lactate_mmol_l = $17, gram_stain_result = $18, \
            culture_result = $19, pcr_result = $20, oligoclonal_bands = $21, xanthochromia = \
            $22, raised_protein = $23, pleocytosis = $24, low_glucose = $25, \
            bacterial_meningitis_pattern = $26, viral_pattern = $27, \
            subarachnoid_haemorrhage_suggested = $28, normal_csf = $29, findings_narrative = \
            $30, impression = $31, reporting_category = $32, recommended_follow_up = $33, \
            critical_result_communicated = $34, reported_to = $35, updated_at = now() WHERE \
            id = $1 RETURNING *",
        )
        .bind(id)
        .bind(self.deleted_at)
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
    let page = paging::resolve(&params)?;
    let (rows, total) = Model::page(&db(&ctx), page).await?;
    paging::respond(page, total, rows)
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
