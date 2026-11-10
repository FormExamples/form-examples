#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::mammography_test_results::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub patient_id: Uuid,
    pub clinician_id: Uuid,
    pub originating_request_reference: String,
    pub report_status: String,
    pub performed_date: Option<Date>,
    pub reported_date: Option<Date>,
    pub exam_type: String,
    pub laterality: String,
    pub examination_adequacy: String,
    pub breast_density: String,
    pub clinical_history: String,
    pub comparison_with_previous: String,
    pub findings_narrative: String,
    pub mass: bool,
    pub calcifications: bool,
    pub architectural_distortion: bool,
    pub asymmetry: bool,
    pub skin_or_nipple_change: bool,
    pub lymphadenopathy: bool,
    pub incidental_finding: bool,
    pub largest_lesion_size_mm: Option<f64>,
    pub impression: String,
    pub bi_rads_category: String,
    pub recommended_follow_up: String,
    pub critical_result_communicated: bool,
    pub reported_to: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO mammography_test_results (patient_id, clinician_id, \
            originating_request_reference, report_status, performed_date, reported_date, \
            exam_type, laterality, examination_adequacy, breast_density, \
            clinical_history, comparison_with_previous, findings_narrative, mass, \
            calcifications, architectural_distortion, asymmetry, skin_or_nipple_change, \
            lymphadenopathy, incidental_finding, largest_lesion_size_mm, impression, \
            bi_rads_category, recommended_follow_up, critical_result_communicated, \
            reported_to) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, \
            $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26) RETURNING *",
        )
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.originating_request_reference)
        .bind(&self.report_status)
        .bind(self.performed_date)
        .bind(self.reported_date)
        .bind(&self.exam_type)
        .bind(&self.laterality)
        .bind(&self.examination_adequacy)
        .bind(&self.breast_density)
        .bind(&self.clinical_history)
        .bind(&self.comparison_with_previous)
        .bind(&self.findings_narrative)
        .bind(self.mass)
        .bind(self.calcifications)
        .bind(self.architectural_distortion)
        .bind(self.asymmetry)
        .bind(self.skin_or_nipple_change)
        .bind(self.lymphadenopathy)
        .bind(self.incidental_finding)
        .bind(self.largest_lesion_size_mm)
        .bind(&self.impression)
        .bind(&self.bi_rads_category)
        .bind(&self.recommended_follow_up)
        .bind(self.critical_result_communicated)
        .bind(&self.reported_to)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE mammography_test_results SET patient_id = $2, clinician_id = $3, \
            originating_request_reference = $4, report_status = $5, performed_date = $6, \
            reported_date = $7, exam_type = $8, laterality = $9, examination_adequacy = \
            $10, breast_density = $11, clinical_history = $12, comparison_with_previous \
            = $13, findings_narrative = $14, mass = $15, calcifications = $16, \
            architectural_distortion = $17, asymmetry = $18, skin_or_nipple_change = \
            $19, lymphadenopathy = $20, incidental_finding = $21, largest_lesion_size_mm \
            = $22, impression = $23, bi_rads_category = $24, recommended_follow_up = \
            $25, critical_result_communicated = $26, reported_to = $27, updated_at = \
            now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.originating_request_reference)
        .bind(&self.report_status)
        .bind(self.performed_date)
        .bind(self.reported_date)
        .bind(&self.exam_type)
        .bind(&self.laterality)
        .bind(&self.examination_adequacy)
        .bind(&self.breast_density)
        .bind(&self.clinical_history)
        .bind(&self.comparison_with_previous)
        .bind(&self.findings_narrative)
        .bind(self.mass)
        .bind(self.calcifications)
        .bind(self.architectural_distortion)
        .bind(self.asymmetry)
        .bind(self.skin_or_nipple_change)
        .bind(self.lymphadenopathy)
        .bind(self.incidental_finding)
        .bind(self.largest_lesion_size_mm)
        .bind(&self.impression)
        .bind(&self.bi_rads_category)
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
        .prefix("api/mammography_test_results/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
