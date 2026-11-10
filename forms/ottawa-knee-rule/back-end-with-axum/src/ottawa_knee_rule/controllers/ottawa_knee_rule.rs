#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::ottawa_knee_rules::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub patient_id: Uuid,
    pub clinician_id: Option<Uuid>,
    pub status: String,
    pub patient_identifier: String,
    pub assessed_at: Option<DateTimeWithTimeZone>,
    pub care_setting: String,
    pub injury_mechanism: String,
    pub hours_since_injury: Option<f64>,
    pub sex: String,
    pub injured_side: String,
    pub age_years: Option<i32>,
    pub patellar_tenderness: String,
    pub other_bony_tenderness: String,
    pub fibular_head_tenderness: String,
    pub unable_to_flex_90: String,
    pub unable_to_bear_weight: String,
    pub clinical_notes: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO ottawa_knee_rules (patient_id, clinician_id, status, \
            patient_identifier, assessed_at, care_setting, injury_mechanism, \
            hours_since_injury, sex, injured_side, age_years, patellar_tenderness, \
            other_bony_tenderness, fibular_head_tenderness, unable_to_flex_90, \
            unable_to_bear_weight, clinical_notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, \
            $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING *",
        )
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.status)
        .bind(&self.patient_identifier)
        .bind(self.assessed_at)
        .bind(&self.care_setting)
        .bind(&self.injury_mechanism)
        .bind(self.hours_since_injury)
        .bind(&self.sex)
        .bind(&self.injured_side)
        .bind(self.age_years)
        .bind(&self.patellar_tenderness)
        .bind(&self.other_bony_tenderness)
        .bind(&self.fibular_head_tenderness)
        .bind(&self.unable_to_flex_90)
        .bind(&self.unable_to_bear_weight)
        .bind(&self.clinical_notes)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE ottawa_knee_rules SET patient_id = $2, clinician_id = $3, status = \
            $4, patient_identifier = $5, assessed_at = $6, care_setting = $7, \
            injury_mechanism = $8, hours_since_injury = $9, sex = $10, injured_side = \
            $11, age_years = $12, patellar_tenderness = $13, other_bony_tenderness = \
            $14, fibular_head_tenderness = $15, unable_to_flex_90 = $16, \
            unable_to_bear_weight = $17, clinical_notes = $18, updated_at = now() WHERE \
            id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.status)
        .bind(&self.patient_identifier)
        .bind(self.assessed_at)
        .bind(&self.care_setting)
        .bind(&self.injury_mechanism)
        .bind(self.hours_since_injury)
        .bind(&self.sex)
        .bind(&self.injured_side)
        .bind(self.age_years)
        .bind(&self.patellar_tenderness)
        .bind(&self.other_bony_tenderness)
        .bind(&self.fibular_head_tenderness)
        .bind(&self.unable_to_flex_90)
        .bind(&self.unable_to_bear_weight)
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
        .prefix("api/ottawa_knee_rules/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
