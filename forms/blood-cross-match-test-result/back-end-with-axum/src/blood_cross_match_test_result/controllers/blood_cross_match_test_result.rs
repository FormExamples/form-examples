#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::blood_cross_match_test_results::Model;

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
    pub request_type: String,
    pub clinical_history: String,
    pub abo_group: String,
    pub rhd_group: String,
    pub antibody_screen_result: String,
    pub antibodies_identified: String,
    pub crossmatch_result: String,
    pub component: String,
    pub units_crossmatched: Option<i32>,
    pub units_available: Option<i32>,
    pub two_sample_rule_met: bool,
    pub special_requirements: String,
    pub historical_group_concordant: bool,
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
            "INSERT INTO blood_cross_match_test_results (deleted_at, patient_id, clinician_id, \
            originating_request_reference, report_status, performed_date, reported_date, \
            request_type, clinical_history, abo_group, rhd_group, antibody_screen_result, \
            antibodies_identified, crossmatch_result, component, units_crossmatched, \
            units_available, two_sample_rule_met, special_requirements, \
            historical_group_concordant, overall_result_status, findings_narrative, \
            impression, reporting_category, recommended_follow_up, \
            critical_result_communicated, reported_to) VALUES ($1, $2, $3, $4, $5, $6, $7, \
            $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, \
            $24, $25, $26, $27) RETURNING *",
        )
        .bind(self.deleted_at)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.originating_request_reference)
        .bind(&self.report_status)
        .bind(self.performed_date)
        .bind(self.reported_date)
        .bind(&self.request_type)
        .bind(&self.clinical_history)
        .bind(&self.abo_group)
        .bind(&self.rhd_group)
        .bind(&self.antibody_screen_result)
        .bind(&self.antibodies_identified)
        .bind(&self.crossmatch_result)
        .bind(&self.component)
        .bind(self.units_crossmatched)
        .bind(self.units_available)
        .bind(self.two_sample_rule_met)
        .bind(&self.special_requirements)
        .bind(self.historical_group_concordant)
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
            "UPDATE blood_cross_match_test_results SET deleted_at = $2, patient_id = $3, \
            clinician_id = $4, originating_request_reference = $5, report_status = $6, \
            performed_date = $7, reported_date = $8, request_type = $9, clinical_history = \
            $10, abo_group = $11, rhd_group = $12, antibody_screen_result = $13, \
            antibodies_identified = $14, crossmatch_result = $15, component = $16, \
            units_crossmatched = $17, units_available = $18, two_sample_rule_met = $19, \
            special_requirements = $20, historical_group_concordant = $21, \
            overall_result_status = $22, findings_narrative = $23, impression = $24, \
            reporting_category = $25, recommended_follow_up = $26, \
            critical_result_communicated = $27, reported_to = $28, updated_at = now() WHERE \
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
        .bind(&self.request_type)
        .bind(&self.clinical_history)
        .bind(&self.abo_group)
        .bind(&self.rhd_group)
        .bind(&self.antibody_screen_result)
        .bind(&self.antibodies_identified)
        .bind(&self.crossmatch_result)
        .bind(&self.component)
        .bind(self.units_crossmatched)
        .bind(self.units_available)
        .bind(self.two_sample_rule_met)
        .bind(&self.special_requirements)
        .bind(self.historical_group_concordant)
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
        .prefix("api/blood_cross_match_test_results/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
