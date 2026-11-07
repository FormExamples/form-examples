#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::toxicology_test_results::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub patient_id: Uuid,
    pub clinician_id: Uuid,
    pub originating_request_reference: String,
    pub report_status: String,
    pub performed_date: Option<Date>,
    pub reported_date: Option<Date>,
    pub specimen_condition: String,
    pub clinical_history: String,
    pub suspected_agent: String,
    pub time_since_ingestion_hours: Option<f64>,
    pub paracetamol_level_mg_l: Option<f64>,
    pub salicylate_level_mg_l: Option<f64>,
    pub ethanol_level: Option<f64>,
    pub lithium_level_mmol_l: Option<f64>,
    pub digoxin_level: Option<f64>,
    pub carboxyhaemoglobin_percent: Option<f64>,
    pub drugs_of_abuse_screen: String,
    pub specific_drug_level: String,
    pub paracetamol_nomogram: String,
    pub overall_result_status: String,
    pub toxic_level_present: bool,
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
            "INSERT INTO toxicology_test_results (patient_id, clinician_id, \
            originating_request_reference, report_status, performed_date, reported_date, \
            specimen_condition, clinical_history, suspected_agent, \
            time_since_ingestion_hours, paracetamol_level_mg_l, salicylate_level_mg_l, \
            ethanol_level, lithium_level_mmol_l, digoxin_level, \
            carboxyhaemoglobin_percent, drugs_of_abuse_screen, specific_drug_level, \
            paracetamol_nomogram, overall_result_status, toxic_level_present, \
            findings_narrative, impression, reporting_category, recommended_follow_up, \
            critical_result_communicated, reported_to) VALUES ($1, $2, $3, $4, $5, $6, \
            $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, \
            $23, $24, $25, $26, $27) RETURNING *",
        )
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.originating_request_reference)
        .bind(&self.report_status)
        .bind(self.performed_date)
        .bind(self.reported_date)
        .bind(&self.specimen_condition)
        .bind(&self.clinical_history)
        .bind(&self.suspected_agent)
        .bind(self.time_since_ingestion_hours)
        .bind(self.paracetamol_level_mg_l)
        .bind(self.salicylate_level_mg_l)
        .bind(self.ethanol_level)
        .bind(self.lithium_level_mmol_l)
        .bind(self.digoxin_level)
        .bind(self.carboxyhaemoglobin_percent)
        .bind(&self.drugs_of_abuse_screen)
        .bind(&self.specific_drug_level)
        .bind(&self.paracetamol_nomogram)
        .bind(&self.overall_result_status)
        .bind(self.toxic_level_present)
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
            "UPDATE toxicology_test_results SET patient_id = $2, clinician_id = $3, \
            originating_request_reference = $4, report_status = $5, performed_date = $6, \
            reported_date = $7, specimen_condition = $8, clinical_history = $9, \
            suspected_agent = $10, time_since_ingestion_hours = $11, \
            paracetamol_level_mg_l = $12, salicylate_level_mg_l = $13, ethanol_level = \
            $14, lithium_level_mmol_l = $15, digoxin_level = $16, \
            carboxyhaemoglobin_percent = $17, drugs_of_abuse_screen = $18, \
            specific_drug_level = $19, paracetamol_nomogram = $20, overall_result_status \
            = $21, toxic_level_present = $22, findings_narrative = $23, impression = \
            $24, reporting_category = $25, recommended_follow_up = $26, \
            critical_result_communicated = $27, reported_to = $28, updated_at = now() \
            WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.originating_request_reference)
        .bind(&self.report_status)
        .bind(self.performed_date)
        .bind(self.reported_date)
        .bind(&self.specimen_condition)
        .bind(&self.clinical_history)
        .bind(&self.suspected_agent)
        .bind(self.time_since_ingestion_hours)
        .bind(self.paracetamol_level_mg_l)
        .bind(self.salicylate_level_mg_l)
        .bind(self.ethanol_level)
        .bind(self.lithium_level_mmol_l)
        .bind(self.digoxin_level)
        .bind(self.carboxyhaemoglobin_percent)
        .bind(&self.drugs_of_abuse_screen)
        .bind(&self.specific_drug_level)
        .bind(&self.paracetamol_nomogram)
        .bind(&self.overall_result_status)
        .bind(self.toxic_level_present)
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
        .prefix("api/toxicology_test_results/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
