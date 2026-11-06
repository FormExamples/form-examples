#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::blood_test_results::Model;

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
    pub specimen_type: String,
    pub specimen_condition: String,
    pub clinical_history: String,
    pub haemoglobin_g_l: Option<f64>,
    pub white_cell_count: Option<f64>,
    pub platelets: Option<f64>,
    pub neutrophils: Option<f64>,
    pub sodium_mmol_l: Option<f64>,
    pub potassium_mmol_l: Option<f64>,
    pub urea_mmol_l: Option<f64>,
    pub creatinine_umol_l: Option<f64>,
    pub egfr: Option<f64>,
    pub alt_u_l: Option<f64>,
    pub alkaline_phosphatase: Option<f64>,
    pub bilirubin_umol_l: Option<f64>,
    pub albumin_g_l: Option<f64>,
    pub c_reactive_protein: Option<f64>,
    pub hba1c_mmol_mol: Option<f64>,
    pub glucose_mmol_l: Option<f64>,
    pub tsh: Option<f64>,
    pub ferritin: Option<f64>,
    pub inr: Option<f64>,
    pub overall_result_status: String,
    pub abnormal_results_present: bool,
    pub critical_value_present: bool,
    pub critical_value_detail: String,
    pub findings_narrative: String,
    pub comparison_with_previous: String,
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
            "INSERT INTO blood_test_results (deleted_at, patient_id, clinician_id, \
            originating_request_reference, report_status, performed_date, reported_date, \
            specimen_type, specimen_condition, clinical_history, haemoglobin_g_l, \
            white_cell_count, platelets, neutrophils, sodium_mmol_l, potassium_mmol_l, \
            urea_mmol_l, creatinine_umol_l, egfr, alt_u_l, alkaline_phosphatase, \
            bilirubin_umol_l, albumin_g_l, c_reactive_protein, hba1c_mmol_mol, \
            glucose_mmol_l, tsh, ferritin, inr, overall_result_status, \
            abnormal_results_present, critical_value_present, critical_value_detail, \
            findings_narrative, comparison_with_previous, impression, reporting_category, \
            recommended_follow_up, critical_result_communicated, reported_to) VALUES ($1, $2, \
            $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, \
            $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, \
            $36, $37, $38, $39, $40) RETURNING *",
        )
        .bind(self.deleted_at)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.originating_request_reference)
        .bind(&self.report_status)
        .bind(self.performed_date)
        .bind(self.reported_date)
        .bind(&self.specimen_type)
        .bind(&self.specimen_condition)
        .bind(&self.clinical_history)
        .bind(self.haemoglobin_g_l)
        .bind(self.white_cell_count)
        .bind(self.platelets)
        .bind(self.neutrophils)
        .bind(self.sodium_mmol_l)
        .bind(self.potassium_mmol_l)
        .bind(self.urea_mmol_l)
        .bind(self.creatinine_umol_l)
        .bind(self.egfr)
        .bind(self.alt_u_l)
        .bind(self.alkaline_phosphatase)
        .bind(self.bilirubin_umol_l)
        .bind(self.albumin_g_l)
        .bind(self.c_reactive_protein)
        .bind(self.hba1c_mmol_mol)
        .bind(self.glucose_mmol_l)
        .bind(self.tsh)
        .bind(self.ferritin)
        .bind(self.inr)
        .bind(&self.overall_result_status)
        .bind(self.abnormal_results_present)
        .bind(self.critical_value_present)
        .bind(&self.critical_value_detail)
        .bind(&self.findings_narrative)
        .bind(&self.comparison_with_previous)
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
            "UPDATE blood_test_results SET deleted_at = $2, patient_id = $3, clinician_id = \
            $4, originating_request_reference = $5, report_status = $6, performed_date = $7, \
            reported_date = $8, specimen_type = $9, specimen_condition = $10, \
            clinical_history = $11, haemoglobin_g_l = $12, white_cell_count = $13, platelets \
            = $14, neutrophils = $15, sodium_mmol_l = $16, potassium_mmol_l = $17, \
            urea_mmol_l = $18, creatinine_umol_l = $19, egfr = $20, alt_u_l = $21, \
            alkaline_phosphatase = $22, bilirubin_umol_l = $23, albumin_g_l = $24, \
            c_reactive_protein = $25, hba1c_mmol_mol = $26, glucose_mmol_l = $27, tsh = $28, \
            ferritin = $29, inr = $30, overall_result_status = $31, abnormal_results_present \
            = $32, critical_value_present = $33, critical_value_detail = $34, \
            findings_narrative = $35, comparison_with_previous = $36, impression = $37, \
            reporting_category = $38, recommended_follow_up = $39, \
            critical_result_communicated = $40, reported_to = $41, updated_at = now() WHERE \
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
        .bind(&self.specimen_type)
        .bind(&self.specimen_condition)
        .bind(&self.clinical_history)
        .bind(self.haemoglobin_g_l)
        .bind(self.white_cell_count)
        .bind(self.platelets)
        .bind(self.neutrophils)
        .bind(self.sodium_mmol_l)
        .bind(self.potassium_mmol_l)
        .bind(self.urea_mmol_l)
        .bind(self.creatinine_umol_l)
        .bind(self.egfr)
        .bind(self.alt_u_l)
        .bind(self.alkaline_phosphatase)
        .bind(self.bilirubin_umol_l)
        .bind(self.albumin_g_l)
        .bind(self.c_reactive_protein)
        .bind(self.hba1c_mmol_mol)
        .bind(self.glucose_mmol_l)
        .bind(self.tsh)
        .bind(self.ferritin)
        .bind(self.inr)
        .bind(&self.overall_result_status)
        .bind(self.abnormal_results_present)
        .bind(self.critical_value_present)
        .bind(&self.critical_value_detail)
        .bind(&self.findings_narrative)
        .bind(&self.comparison_with_previous)
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
        .prefix("api/blood_test_results/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
