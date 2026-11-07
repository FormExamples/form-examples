#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::parkland_formula_for_burns::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub patient_id: Uuid,
    pub clinician_id: Option<Uuid>,
    pub clinician_name: String,
    pub clinician_role: String,
    pub care_setting: String,
    pub assessed_at: Option<DateTimeWithTimeZone>,
    pub patient_identifier: String,
    pub age_band: String,
    pub sex: String,
    pub weight_kg: Option<f64>,
    pub tbsa_percent: Option<f64>,
    pub tbsa_method: String,
    pub injury_at: Option<DateTimeWithTimeZone>,
    pub injury_time_known: String,
    pub inhalation_suspected: String,
    pub circumferential_or_deep: String,
    pub mechanism: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO parkland_formula_for_burns (patient_id, clinician_id, \
            clinician_name, clinician_role, care_setting, assessed_at, \
            patient_identifier, age_band, sex, weight_kg, tbsa_percent, tbsa_method, \
            injury_at, injury_time_known, inhalation_suspected, circumferential_or_deep, \
            mechanism) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, \
            $14, $15, $16, $17) RETURNING *",
        )
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.clinician_name)
        .bind(&self.clinician_role)
        .bind(&self.care_setting)
        .bind(self.assessed_at)
        .bind(&self.patient_identifier)
        .bind(&self.age_band)
        .bind(&self.sex)
        .bind(self.weight_kg)
        .bind(self.tbsa_percent)
        .bind(&self.tbsa_method)
        .bind(self.injury_at)
        .bind(&self.injury_time_known)
        .bind(&self.inhalation_suspected)
        .bind(&self.circumferential_or_deep)
        .bind(&self.mechanism)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE parkland_formula_for_burns SET patient_id = $2, clinician_id = $3, \
            clinician_name = $4, clinician_role = $5, care_setting = $6, assessed_at = \
            $7, patient_identifier = $8, age_band = $9, sex = $10, weight_kg = $11, \
            tbsa_percent = $12, tbsa_method = $13, injury_at = $14, injury_time_known = \
            $15, inhalation_suspected = $16, circumferential_or_deep = $17, mechanism = \
            $18, updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.clinician_name)
        .bind(&self.clinician_role)
        .bind(&self.care_setting)
        .bind(self.assessed_at)
        .bind(&self.patient_identifier)
        .bind(&self.age_band)
        .bind(&self.sex)
        .bind(self.weight_kg)
        .bind(self.tbsa_percent)
        .bind(&self.tbsa_method)
        .bind(self.injury_at)
        .bind(&self.injury_time_known)
        .bind(&self.inhalation_suspected)
        .bind(&self.circumferential_or_deep)
        .bind(&self.mechanism)
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
        .prefix("api/parkland_formula_for_burns/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
