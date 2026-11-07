#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::echocardiogram_test_results::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub patient_id: Uuid,
    pub clinician_id: Uuid,
    pub originating_request_reference: String,
    pub echo_type: String,
    pub performed_date: Option<Date>,
    pub reported_date: Option<Date>,
    pub report_status: String,
    pub study_quality: String,
    pub clinical_history: String,
    pub lv_ejection_fraction_percent: Option<f64>,
    pub lv_function: String,
    pub lv_internal_diameter_diastole_mm: Option<f64>,
    pub aortic_stenosis: String,
    pub aortic_regurgitation: String,
    pub mitral_stenosis: String,
    pub mitral_regurgitation: String,
    pub pulmonary_artery_systolic_pressure_mmhg: Option<f64>,
    pub lv_hypertrophy: bool,
    pub regional_wall_motion_abnormality: bool,
    pub pericardial_effusion: bool,
    pub vegetation: bool,
    pub intracardiac_thrombus: bool,
    pub normal_study: bool,
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
            "INSERT INTO echocardiogram_test_results (patient_id, clinician_id, \
            originating_request_reference, echo_type, performed_date, reported_date, \
            report_status, study_quality, clinical_history, \
            lv_ejection_fraction_percent, lv_function, lv_internal_diameter_diastole_mm, \
            aortic_stenosis, aortic_regurgitation, mitral_stenosis, \
            mitral_regurgitation, pulmonary_artery_systolic_pressure_mmhg, \
            lv_hypertrophy, regional_wall_motion_abnormality, pericardial_effusion, \
            vegetation, intracardiac_thrombus, normal_study, findings_narrative, \
            comparison_with_previous, impression, reporting_category, \
            recommended_follow_up, critical_result_communicated, reported_to) VALUES \
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, \
            $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30) RETURNING *",
        )
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.originating_request_reference)
        .bind(&self.echo_type)
        .bind(self.performed_date)
        .bind(self.reported_date)
        .bind(&self.report_status)
        .bind(&self.study_quality)
        .bind(&self.clinical_history)
        .bind(self.lv_ejection_fraction_percent)
        .bind(&self.lv_function)
        .bind(self.lv_internal_diameter_diastole_mm)
        .bind(&self.aortic_stenosis)
        .bind(&self.aortic_regurgitation)
        .bind(&self.mitral_stenosis)
        .bind(&self.mitral_regurgitation)
        .bind(self.pulmonary_artery_systolic_pressure_mmhg)
        .bind(self.lv_hypertrophy)
        .bind(self.regional_wall_motion_abnormality)
        .bind(self.pericardial_effusion)
        .bind(self.vegetation)
        .bind(self.intracardiac_thrombus)
        .bind(self.normal_study)
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
            "UPDATE echocardiogram_test_results SET patient_id = $2, clinician_id = $3, \
            originating_request_reference = $4, echo_type = $5, performed_date = $6, \
            reported_date = $7, report_status = $8, study_quality = $9, clinical_history \
            = $10, lv_ejection_fraction_percent = $11, lv_function = $12, \
            lv_internal_diameter_diastole_mm = $13, aortic_stenosis = $14, \
            aortic_regurgitation = $15, mitral_stenosis = $16, mitral_regurgitation = \
            $17, pulmonary_artery_systolic_pressure_mmhg = $18, lv_hypertrophy = $19, \
            regional_wall_motion_abnormality = $20, pericardial_effusion = $21, \
            vegetation = $22, intracardiac_thrombus = $23, normal_study = $24, \
            findings_narrative = $25, comparison_with_previous = $26, impression = $27, \
            reporting_category = $28, recommended_follow_up = $29, \
            critical_result_communicated = $30, reported_to = $31, updated_at = now() \
            WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.originating_request_reference)
        .bind(&self.echo_type)
        .bind(self.performed_date)
        .bind(self.reported_date)
        .bind(&self.report_status)
        .bind(&self.study_quality)
        .bind(&self.clinical_history)
        .bind(self.lv_ejection_fraction_percent)
        .bind(&self.lv_function)
        .bind(self.lv_internal_diameter_diastole_mm)
        .bind(&self.aortic_stenosis)
        .bind(&self.aortic_regurgitation)
        .bind(&self.mitral_stenosis)
        .bind(&self.mitral_regurgitation)
        .bind(self.pulmonary_artery_systolic_pressure_mmhg)
        .bind(self.lv_hypertrophy)
        .bind(self.regional_wall_motion_abnormality)
        .bind(self.pericardial_effusion)
        .bind(self.vegetation)
        .bind(self.intracardiac_thrombus)
        .bind(self.normal_study)
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
        .prefix("api/echocardiogram_test_results/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
