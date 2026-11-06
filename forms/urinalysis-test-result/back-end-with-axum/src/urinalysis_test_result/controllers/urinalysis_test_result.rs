#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::urinalysis_test_results::Model;

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
    pub leucocytes: String,
    pub nitrites: String,
    pub protein: String,
    pub blood: String,
    pub glucose: String,
    pub ketones: String,
    pub bilirubin: String,
    pub ph: Option<f64>,
    pub specific_gravity: Option<f64>,
    pub red_cell_count: String,
    pub white_cell_count: String,
    pub epithelial_cells: String,
    pub casts: String,
    pub organisms_seen: bool,
    pub crystals: String,
    pub culture_result: String,
    pub organism_isolated: String,
    pub colony_count_cfu_ml: String,
    pub antibiotic_sensitivities: String,
    pub overall_result_status: String,
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
            "INSERT INTO urinalysis_test_results (deleted_at, patient_id, clinician_id, \
            originating_request_reference, report_status, performed_date, reported_date, \
            specimen_type, specimen_condition, clinical_history, leucocytes, nitrites, \
            protein, blood, glucose, ketones, bilirubin, ph, specific_gravity, \
            red_cell_count, white_cell_count, epithelial_cells, casts, organisms_seen, \
            crystals, culture_result, organism_isolated, colony_count_cfu_ml, \
            antibiotic_sensitivities, overall_result_status, findings_narrative, impression, \
            reporting_category, recommended_follow_up, critical_result_communicated, \
            reported_to) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, \
            $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, \
            $31, $32, $33, $34, $35, $36) RETURNING *",
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
        .bind(&self.leucocytes)
        .bind(&self.nitrites)
        .bind(&self.protein)
        .bind(&self.blood)
        .bind(&self.glucose)
        .bind(&self.ketones)
        .bind(&self.bilirubin)
        .bind(self.ph)
        .bind(self.specific_gravity)
        .bind(&self.red_cell_count)
        .bind(&self.white_cell_count)
        .bind(&self.epithelial_cells)
        .bind(&self.casts)
        .bind(self.organisms_seen)
        .bind(&self.crystals)
        .bind(&self.culture_result)
        .bind(&self.organism_isolated)
        .bind(&self.colony_count_cfu_ml)
        .bind(&self.antibiotic_sensitivities)
        .bind(&self.overall_result_status)
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
            "UPDATE urinalysis_test_results SET deleted_at = $2, patient_id = $3, clinician_id \
            = $4, originating_request_reference = $5, report_status = $6, performed_date = \
            $7, reported_date = $8, specimen_type = $9, specimen_condition = $10, \
            clinical_history = $11, leucocytes = $12, nitrites = $13, protein = $14, blood = \
            $15, glucose = $16, ketones = $17, bilirubin = $18, ph = $19, specific_gravity = \
            $20, red_cell_count = $21, white_cell_count = $22, epithelial_cells = $23, casts \
            = $24, organisms_seen = $25, crystals = $26, culture_result = $27, \
            organism_isolated = $28, colony_count_cfu_ml = $29, antibiotic_sensitivities = \
            $30, overall_result_status = $31, findings_narrative = $32, impression = $33, \
            reporting_category = $34, recommended_follow_up = $35, \
            critical_result_communicated = $36, reported_to = $37, updated_at = now() WHERE \
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
        .bind(&self.leucocytes)
        .bind(&self.nitrites)
        .bind(&self.protein)
        .bind(&self.blood)
        .bind(&self.glucose)
        .bind(&self.ketones)
        .bind(&self.bilirubin)
        .bind(self.ph)
        .bind(self.specific_gravity)
        .bind(&self.red_cell_count)
        .bind(&self.white_cell_count)
        .bind(&self.epithelial_cells)
        .bind(&self.casts)
        .bind(self.organisms_seen)
        .bind(&self.crystals)
        .bind(&self.culture_result)
        .bind(&self.organism_isolated)
        .bind(&self.colony_count_cfu_ml)
        .bind(&self.antibiotic_sensitivities)
        .bind(&self.overall_result_status)
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
        .prefix("api/urinalysis_test_results/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
