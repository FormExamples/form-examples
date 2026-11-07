#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::body_mass_index_and_body_surface_area_calculators::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub patient_id: Uuid,
    pub clinician_id: Option<Uuid>,
    pub clinician_name: String,
    pub clinician_role: String,
    pub assessed_at: Option<DateTimeWithTimeZone>,
    pub care_setting: String,
    pub purpose: String,
    pub patient_identifier: String,
    pub age_band: String,
    pub sex: String,
    pub ancestry: String,
    pub height_cm: Option<f64>,
    pub weight_kg: Option<f64>,
    pub bsa_formula: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO body_mass_index_and_body_surface_area_calculators (patient_id, \
            clinician_id, clinician_name, clinician_role, assessed_at, care_setting, \
            purpose, patient_identifier, age_band, sex, ancestry, height_cm, weight_kg, \
            bsa_formula) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, \
            $14) RETURNING *",
        )
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.clinician_name)
        .bind(&self.clinician_role)
        .bind(self.assessed_at)
        .bind(&self.care_setting)
        .bind(&self.purpose)
        .bind(&self.patient_identifier)
        .bind(&self.age_band)
        .bind(&self.sex)
        .bind(&self.ancestry)
        .bind(self.height_cm)
        .bind(self.weight_kg)
        .bind(&self.bsa_formula)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE body_mass_index_and_body_surface_area_calculators SET patient_id = \
            $2, clinician_id = $3, clinician_name = $4, clinician_role = $5, assessed_at \
            = $6, care_setting = $7, purpose = $8, patient_identifier = $9, age_band = \
            $10, sex = $11, ancestry = $12, height_cm = $13, weight_kg = $14, \
            bsa_formula = $15, updated_at = now() WHERE id = $1 AND deleted_at IS NULL \
            RETURNING *",
        )
        .bind(id)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.clinician_name)
        .bind(&self.clinician_role)
        .bind(self.assessed_at)
        .bind(&self.care_setting)
        .bind(&self.purpose)
        .bind(&self.patient_identifier)
        .bind(&self.age_band)
        .bind(&self.sex)
        .bind(&self.ancestry)
        .bind(self.height_cm)
        .bind(self.weight_kg)
        .bind(&self.bsa_formula)
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
        .prefix("api/body_mass_index_and_body_surface_area_calculators/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
