#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::microbiology_culture_test_results::Model;

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
    pub specimen_site_detail: String,
    pub specimen_condition: String,
    pub clinical_history: String,
    pub gram_stain_result: String,
    pub culture_result: String,
    pub organism_isolated: String,
    pub second_organism_isolated: String,
    pub colony_count: String,
    pub antibiotic_sensitivities: String,
    pub resistance_mrsa: bool,
    pub resistance_esbl: bool,
    pub resistance_cpe: bool,
    pub c_difficile_toxin: String,
    pub acid_fast_bacilli: String,
    pub pcr_result: String,
    pub critical_organism: bool,
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
            "INSERT INTO microbiology_culture_test_results (deleted_at, patient_id, \
            clinician_id, originating_request_reference, report_status, performed_date, \
            reported_date, specimen_type, specimen_site_detail, specimen_condition, \
            clinical_history, gram_stain_result, culture_result, organism_isolated, \
            second_organism_isolated, colony_count, antibiotic_sensitivities, \
            resistance_mrsa, resistance_esbl, resistance_cpe, c_difficile_toxin, \
            acid_fast_bacilli, pcr_result, critical_organism, findings_narrative, impression, \
            reporting_category, recommended_follow_up, critical_result_communicated, \
            reported_to) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, \
            $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30) \
            RETURNING *",
        )
        .bind(self.deleted_at)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.originating_request_reference)
        .bind(&self.report_status)
        .bind(self.performed_date)
        .bind(self.reported_date)
        .bind(&self.specimen_type)
        .bind(&self.specimen_site_detail)
        .bind(&self.specimen_condition)
        .bind(&self.clinical_history)
        .bind(&self.gram_stain_result)
        .bind(&self.culture_result)
        .bind(&self.organism_isolated)
        .bind(&self.second_organism_isolated)
        .bind(&self.colony_count)
        .bind(&self.antibiotic_sensitivities)
        .bind(self.resistance_mrsa)
        .bind(self.resistance_esbl)
        .bind(self.resistance_cpe)
        .bind(&self.c_difficile_toxin)
        .bind(&self.acid_fast_bacilli)
        .bind(&self.pcr_result)
        .bind(self.critical_organism)
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
            "UPDATE microbiology_culture_test_results SET deleted_at = $2, patient_id = $3, \
            clinician_id = $4, originating_request_reference = $5, report_status = $6, \
            performed_date = $7, reported_date = $8, specimen_type = $9, specimen_site_detail \
            = $10, specimen_condition = $11, clinical_history = $12, gram_stain_result = $13, \
            culture_result = $14, organism_isolated = $15, second_organism_isolated = $16, \
            colony_count = $17, antibiotic_sensitivities = $18, resistance_mrsa = $19, \
            resistance_esbl = $20, resistance_cpe = $21, c_difficile_toxin = $22, \
            acid_fast_bacilli = $23, pcr_result = $24, critical_organism = $25, \
            findings_narrative = $26, impression = $27, reporting_category = $28, \
            recommended_follow_up = $29, critical_result_communicated = $30, reported_to = \
            $31, updated_at = now() WHERE id = $1 RETURNING *",
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
        .bind(&self.specimen_site_detail)
        .bind(&self.specimen_condition)
        .bind(&self.clinical_history)
        .bind(&self.gram_stain_result)
        .bind(&self.culture_result)
        .bind(&self.organism_isolated)
        .bind(&self.second_organism_isolated)
        .bind(&self.colony_count)
        .bind(&self.antibiotic_sensitivities)
        .bind(self.resistance_mrsa)
        .bind(self.resistance_esbl)
        .bind(self.resistance_cpe)
        .bind(&self.c_difficile_toxin)
        .bind(&self.acid_fast_bacilli)
        .bind(&self.pcr_result)
        .bind(self.critical_organism)
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
        .prefix("api/microbiology_culture_test_results/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
