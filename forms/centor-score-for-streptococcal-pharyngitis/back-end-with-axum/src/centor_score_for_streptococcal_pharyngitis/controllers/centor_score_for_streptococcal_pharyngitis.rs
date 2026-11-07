#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::centor_score_for_streptococcal_pharyngitis::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub patient_id: Uuid,
    pub clinician_id: Option<Uuid>,
    pub clinician_name: String,
    pub clinician_role: String,
    pub assessed_at: Option<DateTimeWithTimeZone>,
    pub care_setting: String,
    pub patient_identifier: String,
    pub age_years: Option<i32>,
    pub sex: String,
    pub tonsillar_exudate: String,
    pub tender_anterior_cervical_nodes: String,
    pub fever_over_38: String,
    pub measured_temperature_celsius: Option<f64>,
    pub absence_of_cough: String,
    pub stridor_or_breathing_difficulty: String,
    pub drooling_or_cannot_swallow: String,
    pub trismus: String,
    pub muffled_voice: String,
    pub unilateral_neck_swelling: String,
    pub clinical_note: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO centor_score_for_streptococcal_pharyngitis (patient_id, clinician_id, \
            clinician_name, clinician_role, assessed_at, care_setting, patient_identifier, \
            age_years, sex, tonsillar_exudate, tender_anterior_cervical_nodes, fever_over_38, \
            measured_temperature_celsius, absence_of_cough, stridor_or_breathing_difficulty, \
            drooling_or_cannot_swallow, trismus, muffled_voice, unilateral_neck_swelling, \
            clinical_note) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, \
            $14, $15, $16, $17, $18, $19, $20) RETURNING *",
        )
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.clinician_name)
        .bind(&self.clinician_role)
        .bind(self.assessed_at)
        .bind(&self.care_setting)
        .bind(&self.patient_identifier)
        .bind(self.age_years)
        .bind(&self.sex)
        .bind(&self.tonsillar_exudate)
        .bind(&self.tender_anterior_cervical_nodes)
        .bind(&self.fever_over_38)
        .bind(self.measured_temperature_celsius)
        .bind(&self.absence_of_cough)
        .bind(&self.stridor_or_breathing_difficulty)
        .bind(&self.drooling_or_cannot_swallow)
        .bind(&self.trismus)
        .bind(&self.muffled_voice)
        .bind(&self.unilateral_neck_swelling)
        .bind(&self.clinical_note)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE centor_score_for_streptococcal_pharyngitis SET patient_id = $2, \
            clinician_id = $3, clinician_name = $4, clinician_role = $5, assessed_at = \
            $6, care_setting = $7, patient_identifier = $8, age_years = $9, sex = $10, \
            tonsillar_exudate = $11, tender_anterior_cervical_nodes = $12, fever_over_38 \
            = $13, measured_temperature_celsius = $14, absence_of_cough = $15, \
            stridor_or_breathing_difficulty = $16, drooling_or_cannot_swallow = $17, \
            trismus = $18, muffled_voice = $19, unilateral_neck_swelling = $20, \
            clinical_note = $21, updated_at = now() WHERE id = $1 AND deleted_at IS NULL \
            RETURNING *",
        )
        .bind(id)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.clinician_name)
        .bind(&self.clinician_role)
        .bind(self.assessed_at)
        .bind(&self.care_setting)
        .bind(&self.patient_identifier)
        .bind(self.age_years)
        .bind(&self.sex)
        .bind(&self.tonsillar_exudate)
        .bind(&self.tender_anterior_cervical_nodes)
        .bind(&self.fever_over_38)
        .bind(self.measured_temperature_celsius)
        .bind(&self.absence_of_cough)
        .bind(&self.stridor_or_breathing_difficulty)
        .bind(&self.drooling_or_cannot_swallow)
        .bind(&self.trismus)
        .bind(&self.muffled_voice)
        .bind(&self.unilateral_neck_swelling)
        .bind(&self.clinical_note)
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
        .prefix("api/centor_score_for_streptococcal_pharyngitis/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
