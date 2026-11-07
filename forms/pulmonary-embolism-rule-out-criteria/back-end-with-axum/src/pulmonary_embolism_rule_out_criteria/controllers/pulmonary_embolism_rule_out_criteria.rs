#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::pulmonary_embolism_rule_out_criteria::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub patient_id: Uuid,
    pub clinician_id: Option<Uuid>,
    pub status: String,
    pub patient_identifier: String,
    pub assessed_at: Option<DateTimeWithTimeZone>,
    pub care_setting: String,
    pub presenting_complaint: String,
    pub age: Option<f64>,
    pub heart_rate: Option<f64>,
    pub oxygen_saturation: Option<f64>,
    pub pretest_probability: String,
    pub age_under_50: String,
    pub heart_rate_under_100: String,
    pub spo2_at_least_95: String,
    pub no_unilateral_leg_swelling: String,
    pub no_haemoptysis: String,
    pub no_recent_surgery_trauma: String,
    pub no_prior_dvt_pe: String,
    pub no_oestrogen_use: String,
    pub clinical_notes: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO pulmonary_embolism_rule_out_criteria (patient_id, clinician_id, \
            status, patient_identifier, assessed_at, care_setting, presenting_complaint, age, \
            heart_rate, oxygen_saturation, pretest_probability, age_under_50, \
            heart_rate_under_100, spo2_at_least_95, no_unilateral_leg_swelling, \
            no_haemoptysis, no_recent_surgery_trauma, no_prior_dvt_pe, no_oestrogen_use, \
            clinical_notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, \
            $14, $15, $16, $17, $18, $19, $20) RETURNING *",
        )
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.status)
        .bind(&self.patient_identifier)
        .bind(self.assessed_at)
        .bind(&self.care_setting)
        .bind(&self.presenting_complaint)
        .bind(self.age)
        .bind(self.heart_rate)
        .bind(self.oxygen_saturation)
        .bind(&self.pretest_probability)
        .bind(&self.age_under_50)
        .bind(&self.heart_rate_under_100)
        .bind(&self.spo2_at_least_95)
        .bind(&self.no_unilateral_leg_swelling)
        .bind(&self.no_haemoptysis)
        .bind(&self.no_recent_surgery_trauma)
        .bind(&self.no_prior_dvt_pe)
        .bind(&self.no_oestrogen_use)
        .bind(&self.clinical_notes)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE pulmonary_embolism_rule_out_criteria SET patient_id = $2, \
            clinician_id = $3, status = $4, patient_identifier = $5, assessed_at = $6, \
            care_setting = $7, presenting_complaint = $8, age = $9, heart_rate = $10, \
            oxygen_saturation = $11, pretest_probability = $12, age_under_50 = $13, \
            heart_rate_under_100 = $14, spo2_at_least_95 = $15, \
            no_unilateral_leg_swelling = $16, no_haemoptysis = $17, \
            no_recent_surgery_trauma = $18, no_prior_dvt_pe = $19, no_oestrogen_use = \
            $20, clinical_notes = $21, updated_at = now() WHERE id = $1 AND deleted_at \
            IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.status)
        .bind(&self.patient_identifier)
        .bind(self.assessed_at)
        .bind(&self.care_setting)
        .bind(&self.presenting_complaint)
        .bind(self.age)
        .bind(self.heart_rate)
        .bind(self.oxygen_saturation)
        .bind(&self.pretest_probability)
        .bind(&self.age_under_50)
        .bind(&self.heart_rate_under_100)
        .bind(&self.spo2_at_least_95)
        .bind(&self.no_unilateral_leg_swelling)
        .bind(&self.no_haemoptysis)
        .bind(&self.no_recent_surgery_trauma)
        .bind(&self.no_prior_dvt_pe)
        .bind(&self.no_oestrogen_use)
        .bind(&self.clinical_notes)
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
        .prefix("api/pulmonary_embolism_rule_out_criteria/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
