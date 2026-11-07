#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::corrected_calcium_calculators::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub patient_id: Uuid,
    pub clinician_id: Option<Uuid>,
    pub clinician_name: String,
    pub clinician_role: String,
    pub assessed_at: Option<DateTimeWithTimeZone>,
    pub care_setting: String,
    pub sample_reference: String,
    pub patient_identifier: String,
    pub age_band: String,
    pub sex: String,
    pub total_calcium_mmol_l: Option<f64>,
    pub albumin_g_l: Option<f64>,
    pub symptomatic: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO corrected_calcium_calculators (patient_id, clinician_id, \
            clinician_name, clinician_role, assessed_at, care_setting, sample_reference, \
            patient_identifier, age_band, sex, total_calcium_mmol_l, albumin_g_l, \
            symptomatic) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) \
            RETURNING *",
        )
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.clinician_name)
        .bind(&self.clinician_role)
        .bind(self.assessed_at)
        .bind(&self.care_setting)
        .bind(&self.sample_reference)
        .bind(&self.patient_identifier)
        .bind(&self.age_band)
        .bind(&self.sex)
        .bind(self.total_calcium_mmol_l)
        .bind(self.albumin_g_l)
        .bind(&self.symptomatic)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE corrected_calcium_calculators SET patient_id = $2, clinician_id = $3, \
            clinician_name = $4, clinician_role = $5, assessed_at = $6, care_setting = \
            $7, sample_reference = $8, patient_identifier = $9, age_band = $10, sex = \
            $11, total_calcium_mmol_l = $12, albumin_g_l = $13, symptomatic = $14, \
            updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.clinician_name)
        .bind(&self.clinician_role)
        .bind(self.assessed_at)
        .bind(&self.care_setting)
        .bind(&self.sample_reference)
        .bind(&self.patient_identifier)
        .bind(&self.age_band)
        .bind(&self.sex)
        .bind(self.total_calcium_mmol_l)
        .bind(self.albumin_g_l)
        .bind(&self.symptomatic)
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
        .prefix("api/corrected_calcium_calculators/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
