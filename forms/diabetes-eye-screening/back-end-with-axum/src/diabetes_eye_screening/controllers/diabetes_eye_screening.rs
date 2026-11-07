#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::diabetes_eye_screenings::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub patient_id: Uuid,
    pub clinician_id: Option<Uuid>,
    pub grader_name: String,
    pub grader_role: String,
    pub graded_at: Option<Date>,
    pub image_captured_at: Option<Date>,
    pub imaging_media: String,
    pub patient_identifier: String,
    pub age_band: String,
    pub diabetes_type: String,
    pub years_since_diagnosis: Option<f64>,
    pub previous_screen_date: Option<Date>,
    pub previous_screen_result: String,
    pub right_retinopathy_grade: String,
    pub right_maculopathy_grade: String,
    pub right_photocoagulation: String,
    pub right_ungradable: String,
    pub right_visual_acuity: String,
    pub left_retinopathy_grade: String,
    pub left_maculopathy_grade: String,
    pub left_photocoagulation: String,
    pub left_ungradable: String,
    pub left_visual_acuity: String,
    pub clinical_context: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO diabetes_eye_screenings (patient_id, clinician_id, grader_name, \
            grader_role, graded_at, image_captured_at, imaging_media, patient_identifier, \
            age_band, diabetes_type, years_since_diagnosis, previous_screen_date, \
            previous_screen_result, right_retinopathy_grade, right_maculopathy_grade, \
            right_photocoagulation, right_ungradable, right_visual_acuity, \
            left_retinopathy_grade, left_maculopathy_grade, left_photocoagulation, \
            left_ungradable, left_visual_acuity, clinical_context) VALUES ($1, $2, $3, $4, \
            $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, \
            $22, $23, $24) RETURNING *",
        )
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.grader_name)
        .bind(&self.grader_role)
        .bind(self.graded_at)
        .bind(self.image_captured_at)
        .bind(&self.imaging_media)
        .bind(&self.patient_identifier)
        .bind(&self.age_band)
        .bind(&self.diabetes_type)
        .bind(self.years_since_diagnosis)
        .bind(self.previous_screen_date)
        .bind(&self.previous_screen_result)
        .bind(&self.right_retinopathy_grade)
        .bind(&self.right_maculopathy_grade)
        .bind(&self.right_photocoagulation)
        .bind(&self.right_ungradable)
        .bind(&self.right_visual_acuity)
        .bind(&self.left_retinopathy_grade)
        .bind(&self.left_maculopathy_grade)
        .bind(&self.left_photocoagulation)
        .bind(&self.left_ungradable)
        .bind(&self.left_visual_acuity)
        .bind(&self.clinical_context)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE diabetes_eye_screenings SET patient_id = $2, clinician_id = $3, \
            grader_name = $4, grader_role = $5, graded_at = $6, image_captured_at = $7, \
            imaging_media = $8, patient_identifier = $9, age_band = $10, diabetes_type = \
            $11, years_since_diagnosis = $12, previous_screen_date = $13, \
            previous_screen_result = $14, right_retinopathy_grade = $15, \
            right_maculopathy_grade = $16, right_photocoagulation = $17, \
            right_ungradable = $18, right_visual_acuity = $19, left_retinopathy_grade = \
            $20, left_maculopathy_grade = $21, left_photocoagulation = $22, \
            left_ungradable = $23, left_visual_acuity = $24, clinical_context = $25, \
            updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.grader_name)
        .bind(&self.grader_role)
        .bind(self.graded_at)
        .bind(self.image_captured_at)
        .bind(&self.imaging_media)
        .bind(&self.patient_identifier)
        .bind(&self.age_band)
        .bind(&self.diabetes_type)
        .bind(self.years_since_diagnosis)
        .bind(self.previous_screen_date)
        .bind(&self.previous_screen_result)
        .bind(&self.right_retinopathy_grade)
        .bind(&self.right_maculopathy_grade)
        .bind(&self.right_photocoagulation)
        .bind(&self.right_ungradable)
        .bind(&self.right_visual_acuity)
        .bind(&self.left_retinopathy_grade)
        .bind(&self.left_maculopathy_grade)
        .bind(&self.left_photocoagulation)
        .bind(&self.left_ungradable)
        .bind(&self.left_visual_acuity)
        .bind(&self.clinical_context)
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
        .prefix("api/diabetes_eye_screenings/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
