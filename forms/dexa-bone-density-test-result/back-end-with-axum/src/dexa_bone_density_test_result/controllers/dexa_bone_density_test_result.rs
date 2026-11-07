#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::dexa_bone_density_test_results::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub patient_id: Uuid,
    pub clinician_id: Uuid,
    pub originating_request_reference: String,
    pub report_status: String,
    pub performed_date: Option<Date>,
    pub reported_date: Option<Date>,
    pub scan_region: String,
    pub examination_adequacy: String,
    pub clinical_history: String,
    pub lumbar_spine_t_score: Option<f64>,
    pub lumbar_spine_z_score: Option<f64>,
    pub femoral_neck_t_score: Option<f64>,
    pub femoral_neck_z_score: Option<f64>,
    pub total_hip_t_score: Option<f64>,
    pub lowest_t_score: Option<f64>,
    pub bone_mineral_density_g_cm2: Option<f64>,
    pub who_classification: String,
    pub frax_major_fracture_percent: Option<f64>,
    pub frax_hip_fracture_percent: Option<f64>,
    pub vertebral_fracture_identified: bool,
    pub comparison_with_previous: String,
    pub percent_change_since_previous: Option<f64>,
    pub impression: String,
    pub recommended_follow_up: String,
    pub critical_result_communicated: bool,
    pub reported_to: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO dexa_bone_density_test_results (patient_id, clinician_id, \
            originating_request_reference, report_status, performed_date, reported_date, \
            scan_region, examination_adequacy, clinical_history, lumbar_spine_t_score, \
            lumbar_spine_z_score, femoral_neck_t_score, femoral_neck_z_score, \
            total_hip_t_score, lowest_t_score, bone_mineral_density_g_cm2, \
            who_classification, frax_major_fracture_percent, frax_hip_fracture_percent, \
            vertebral_fracture_identified, comparison_with_previous, \
            percent_change_since_previous, impression, recommended_follow_up, \
            critical_result_communicated, reported_to) VALUES ($1, $2, $3, $4, $5, $6, \
            $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, \
            $23, $24, $25, $26) RETURNING *",
        )
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.originating_request_reference)
        .bind(&self.report_status)
        .bind(self.performed_date)
        .bind(self.reported_date)
        .bind(&self.scan_region)
        .bind(&self.examination_adequacy)
        .bind(&self.clinical_history)
        .bind(self.lumbar_spine_t_score)
        .bind(self.lumbar_spine_z_score)
        .bind(self.femoral_neck_t_score)
        .bind(self.femoral_neck_z_score)
        .bind(self.total_hip_t_score)
        .bind(self.lowest_t_score)
        .bind(self.bone_mineral_density_g_cm2)
        .bind(&self.who_classification)
        .bind(self.frax_major_fracture_percent)
        .bind(self.frax_hip_fracture_percent)
        .bind(self.vertebral_fracture_identified)
        .bind(&self.comparison_with_previous)
        .bind(self.percent_change_since_previous)
        .bind(&self.impression)
        .bind(&self.recommended_follow_up)
        .bind(self.critical_result_communicated)
        .bind(&self.reported_to)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE dexa_bone_density_test_results SET patient_id = $2, clinician_id = \
            $3, originating_request_reference = $4, report_status = $5, performed_date = \
            $6, reported_date = $7, scan_region = $8, examination_adequacy = $9, \
            clinical_history = $10, lumbar_spine_t_score = $11, lumbar_spine_z_score = \
            $12, femoral_neck_t_score = $13, femoral_neck_z_score = $14, \
            total_hip_t_score = $15, lowest_t_score = $16, bone_mineral_density_g_cm2 = \
            $17, who_classification = $18, frax_major_fracture_percent = $19, \
            frax_hip_fracture_percent = $20, vertebral_fracture_identified = $21, \
            comparison_with_previous = $22, percent_change_since_previous = $23, \
            impression = $24, recommended_follow_up = $25, critical_result_communicated \
            = $26, reported_to = $27, updated_at = now() WHERE id = $1 AND deleted_at IS \
            NULL RETURNING *",
        )
        .bind(id)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.originating_request_reference)
        .bind(&self.report_status)
        .bind(self.performed_date)
        .bind(self.reported_date)
        .bind(&self.scan_region)
        .bind(&self.examination_adequacy)
        .bind(&self.clinical_history)
        .bind(self.lumbar_spine_t_score)
        .bind(self.lumbar_spine_z_score)
        .bind(self.femoral_neck_t_score)
        .bind(self.femoral_neck_z_score)
        .bind(self.total_hip_t_score)
        .bind(self.lowest_t_score)
        .bind(self.bone_mineral_density_g_cm2)
        .bind(&self.who_classification)
        .bind(self.frax_major_fracture_percent)
        .bind(self.frax_hip_fracture_percent)
        .bind(self.vertebral_fracture_identified)
        .bind(&self.comparison_with_previous)
        .bind(self.percent_change_since_previous)
        .bind(&self.impression)
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
        .prefix("api/dexa_bone_density_test_results/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
