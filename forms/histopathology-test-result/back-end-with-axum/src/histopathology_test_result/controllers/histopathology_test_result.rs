#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::histopathology_test_results::Model;

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
    pub specimen_site: String,
    pub specimen_adequacy: String,
    pub clinical_history: String,
    pub macroscopic_description: String,
    pub microscopic_description: String,
    pub diagnosis: String,
    pub malignancy_present: bool,
    pub tumour_type: String,
    pub histological_grade: String,
    pub tnm_pt: String,
    pub tnm_pn: String,
    pub tnm_pm: String,
    pub resection_margins: String,
    pub lymphovascular_invasion: bool,
    pub immunohistochemistry: String,
    pub snomed_code: String,
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
            "INSERT INTO histopathology_test_results (deleted_at, patient_id, clinician_id, \
            originating_request_reference, report_status, performed_date, reported_date, \
            specimen_type, specimen_site, specimen_adequacy, clinical_history, \
            macroscopic_description, microscopic_description, diagnosis, malignancy_present, \
            tumour_type, histological_grade, tnm_pt, tnm_pn, tnm_pm, resection_margins, \
            lymphovascular_invasion, immunohistochemistry, snomed_code, \
            comparison_with_previous, impression, reporting_category, recommended_follow_up, \
            critical_result_communicated, reported_to) VALUES ($1, $2, $3, $4, $5, $6, $7, \
            $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, \
            $24, $25, $26, $27, $28, $29, $30) RETURNING *",
        )
        .bind(self.deleted_at)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.originating_request_reference)
        .bind(&self.report_status)
        .bind(self.performed_date)
        .bind(self.reported_date)
        .bind(&self.specimen_type)
        .bind(&self.specimen_site)
        .bind(&self.specimen_adequacy)
        .bind(&self.clinical_history)
        .bind(&self.macroscopic_description)
        .bind(&self.microscopic_description)
        .bind(&self.diagnosis)
        .bind(self.malignancy_present)
        .bind(&self.tumour_type)
        .bind(&self.histological_grade)
        .bind(&self.tnm_pt)
        .bind(&self.tnm_pn)
        .bind(&self.tnm_pm)
        .bind(&self.resection_margins)
        .bind(self.lymphovascular_invasion)
        .bind(&self.immunohistochemistry)
        .bind(&self.snomed_code)
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
            "UPDATE histopathology_test_results SET deleted_at = $2, patient_id = $3, \
            clinician_id = $4, originating_request_reference = $5, report_status = $6, \
            performed_date = $7, reported_date = $8, specimen_type = $9, specimen_site = $10, \
            specimen_adequacy = $11, clinical_history = $12, macroscopic_description = $13, \
            microscopic_description = $14, diagnosis = $15, malignancy_present = $16, \
            tumour_type = $17, histological_grade = $18, tnm_pt = $19, tnm_pn = $20, tnm_pm = \
            $21, resection_margins = $22, lymphovascular_invasion = $23, immunohistochemistry \
            = $24, snomed_code = $25, comparison_with_previous = $26, impression = $27, \
            reporting_category = $28, recommended_follow_up = $29, \
            critical_result_communicated = $30, reported_to = $31, updated_at = now() WHERE \
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
        .bind(&self.specimen_site)
        .bind(&self.specimen_adequacy)
        .bind(&self.clinical_history)
        .bind(&self.macroscopic_description)
        .bind(&self.microscopic_description)
        .bind(&self.diagnosis)
        .bind(self.malignancy_present)
        .bind(&self.tumour_type)
        .bind(&self.histological_grade)
        .bind(&self.tnm_pt)
        .bind(&self.tnm_pn)
        .bind(&self.tnm_pm)
        .bind(&self.resection_margins)
        .bind(self.lymphovascular_invasion)
        .bind(&self.immunohistochemistry)
        .bind(&self.snomed_code)
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
        .prefix("api/histopathology_test_results/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
