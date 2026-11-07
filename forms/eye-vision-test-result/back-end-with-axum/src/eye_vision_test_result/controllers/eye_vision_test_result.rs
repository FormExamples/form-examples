#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::eye_vision_test_results::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub patient_id: Uuid,
    pub clinician_id: Uuid,
    pub originating_request_reference: String,
    pub report_status: String,
    pub test_type: String,
    pub performed_date: Option<Date>,
    pub reported_date: Option<Date>,
    pub clinical_history: String,
    pub visual_acuity_right: String,
    pub visual_acuity_left: String,
    pub intraocular_pressure_right_mmhg: Option<f64>,
    pub intraocular_pressure_left_mmhg: Option<f64>,
    pub visual_field_result: String,
    pub reduced_visual_acuity: bool,
    pub visual_field_defect: bool,
    pub raised_intraocular_pressure: bool,
    pub diabetic_retinopathy: bool,
    pub optic_disc_abnormality: bool,
    pub macular_abnormality: bool,
    pub normal_examination: bool,
    pub retinopathy_grade: String,
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
            "INSERT INTO eye_vision_test_results (patient_id, clinician_id, \
            originating_request_reference, report_status, test_type, performed_date, \
            reported_date, clinical_history, visual_acuity_right, visual_acuity_left, \
            intraocular_pressure_right_mmhg, intraocular_pressure_left_mmhg, \
            visual_field_result, reduced_visual_acuity, visual_field_defect, \
            raised_intraocular_pressure, diabetic_retinopathy, optic_disc_abnormality, \
            macular_abnormality, normal_examination, retinopathy_grade, \
            findings_narrative, impression, reporting_category, recommended_follow_up, \
            critical_result_communicated, reported_to) VALUES ($1, $2, $3, $4, $5, $6, \
            $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, \
            $23, $24, $25, $26, $27) RETURNING *",
        )
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.originating_request_reference)
        .bind(&self.report_status)
        .bind(&self.test_type)
        .bind(self.performed_date)
        .bind(self.reported_date)
        .bind(&self.clinical_history)
        .bind(&self.visual_acuity_right)
        .bind(&self.visual_acuity_left)
        .bind(self.intraocular_pressure_right_mmhg)
        .bind(self.intraocular_pressure_left_mmhg)
        .bind(&self.visual_field_result)
        .bind(self.reduced_visual_acuity)
        .bind(self.visual_field_defect)
        .bind(self.raised_intraocular_pressure)
        .bind(self.diabetic_retinopathy)
        .bind(self.optic_disc_abnormality)
        .bind(self.macular_abnormality)
        .bind(self.normal_examination)
        .bind(&self.retinopathy_grade)
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
            "UPDATE eye_vision_test_results SET patient_id = $2, clinician_id = $3, \
            originating_request_reference = $4, report_status = $5, test_type = $6, \
            performed_date = $7, reported_date = $8, clinical_history = $9, \
            visual_acuity_right = $10, visual_acuity_left = $11, \
            intraocular_pressure_right_mmhg = $12, intraocular_pressure_left_mmhg = $13, \
            visual_field_result = $14, reduced_visual_acuity = $15, visual_field_defect \
            = $16, raised_intraocular_pressure = $17, diabetic_retinopathy = $18, \
            optic_disc_abnormality = $19, macular_abnormality = $20, normal_examination \
            = $21, retinopathy_grade = $22, findings_narrative = $23, impression = $24, \
            reporting_category = $25, recommended_follow_up = $26, \
            critical_result_communicated = $27, reported_to = $28, updated_at = now() \
            WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.originating_request_reference)
        .bind(&self.report_status)
        .bind(&self.test_type)
        .bind(self.performed_date)
        .bind(self.reported_date)
        .bind(&self.clinical_history)
        .bind(&self.visual_acuity_right)
        .bind(&self.visual_acuity_left)
        .bind(self.intraocular_pressure_right_mmhg)
        .bind(self.intraocular_pressure_left_mmhg)
        .bind(&self.visual_field_result)
        .bind(self.reduced_visual_acuity)
        .bind(self.visual_field_defect)
        .bind(self.raised_intraocular_pressure)
        .bind(self.diabetic_retinopathy)
        .bind(self.optic_disc_abnormality)
        .bind(self.macular_abnormality)
        .bind(self.normal_examination)
        .bind(&self.retinopathy_grade)
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
        .prefix("api/eye_vision_test_results/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
