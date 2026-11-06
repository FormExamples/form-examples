#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::biopsy_test_results::Model;

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
    pub biopsy_site: String,
    pub biopsy_method: String,
    pub specimen_adequacy: String,
    pub clinical_history: String,
    pub comparison_with_previous: String,
    pub macroscopic_description: String,
    pub microscopic_description: String,
    pub diagnosis: String,
    pub malignancy_present: bool,
    pub tumour_type: String,
    pub histological_grade: String,
    pub resection_margins: String,
    pub lymphovascular_invasion: bool,
    pub immunohistochemistry: String,
    pub molecular_results: String,
    pub snomed_code: String,
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
            "INSERT INTO biopsy_test_results (deleted_at, patient_id, clinician_id, \
            originating_request_reference, report_status, performed_date, reported_date, \
            biopsy_site, biopsy_method, specimen_adequacy, clinical_history, \
            comparison_with_previous, macroscopic_description, microscopic_description, \
            diagnosis, malignancy_present, tumour_type, histological_grade, \
            resection_margins, lymphovascular_invasion, immunohistochemistry, \
            molecular_results, snomed_code, impression, reporting_category, \
            recommended_follow_up, critical_result_communicated, reported_to) VALUES ($1, $2, \
            $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, \
            $20, $21, $22, $23, $24, $25, $26, $27, $28) RETURNING *",
        )
        .bind(self.deleted_at)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.originating_request_reference)
        .bind(&self.report_status)
        .bind(self.performed_date)
        .bind(self.reported_date)
        .bind(&self.biopsy_site)
        .bind(&self.biopsy_method)
        .bind(&self.specimen_adequacy)
        .bind(&self.clinical_history)
        .bind(&self.comparison_with_previous)
        .bind(&self.macroscopic_description)
        .bind(&self.microscopic_description)
        .bind(&self.diagnosis)
        .bind(self.malignancy_present)
        .bind(&self.tumour_type)
        .bind(&self.histological_grade)
        .bind(&self.resection_margins)
        .bind(self.lymphovascular_invasion)
        .bind(&self.immunohistochemistry)
        .bind(&self.molecular_results)
        .bind(&self.snomed_code)
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
            "UPDATE biopsy_test_results SET deleted_at = $2, patient_id = $3, clinician_id = \
            $4, originating_request_reference = $5, report_status = $6, performed_date = $7, \
            reported_date = $8, biopsy_site = $9, biopsy_method = $10, specimen_adequacy = \
            $11, clinical_history = $12, comparison_with_previous = $13, \
            macroscopic_description = $14, microscopic_description = $15, diagnosis = $16, \
            malignancy_present = $17, tumour_type = $18, histological_grade = $19, \
            resection_margins = $20, lymphovascular_invasion = $21, immunohistochemistry = \
            $22, molecular_results = $23, snomed_code = $24, impression = $25, \
            reporting_category = $26, recommended_follow_up = $27, \
            critical_result_communicated = $28, reported_to = $29, updated_at = now() WHERE \
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
        .bind(&self.biopsy_site)
        .bind(&self.biopsy_method)
        .bind(&self.specimen_adequacy)
        .bind(&self.clinical_history)
        .bind(&self.comparison_with_previous)
        .bind(&self.macroscopic_description)
        .bind(&self.microscopic_description)
        .bind(&self.diagnosis)
        .bind(self.malignancy_present)
        .bind(&self.tumour_type)
        .bind(&self.histological_grade)
        .bind(&self.resection_margins)
        .bind(self.lymphovascular_invasion)
        .bind(&self.immunohistochemistry)
        .bind(&self.molecular_results)
        .bind(&self.snomed_code)
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
        .prefix("api/biopsy_test_results/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
