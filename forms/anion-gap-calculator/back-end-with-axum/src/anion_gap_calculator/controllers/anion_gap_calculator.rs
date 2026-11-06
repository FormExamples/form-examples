#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::anion_gap_calculators::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub deleted_at: Option<DateTimeWithTimeZone>,
    pub patient_id: Uuid,
    pub clinician_id: Option<Uuid>,
    pub clinician_name: String,
    pub clinician_role: String,
    pub calculated_at: Option<DateTimeWithTimeZone>,
    pub care_setting: String,
    pub clinical_context: String,
    pub patient_identifier: String,
    pub age_band: String,
    pub sex: String,
    pub sodium_mmol_l: Option<f64>,
    pub potassium_mmol_l: Option<f64>,
    pub chloride_mmol_l: Option<f64>,
    pub bicarbonate_mmol_l: Option<f64>,
    pub albumin_g_l: Option<f64>,
    pub include_potassium: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO anion_gap_calculators (deleted_at, patient_id, clinician_id, \
            clinician_name, clinician_role, calculated_at, care_setting, clinical_context, \
            patient_identifier, age_band, sex, sodium_mmol_l, potassium_mmol_l, \
            chloride_mmol_l, bicarbonate_mmol_l, albumin_g_l, include_potassium) VALUES ($1, \
            $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING \
            *",
        )
        .bind(self.deleted_at)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.clinician_name)
        .bind(&self.clinician_role)
        .bind(self.calculated_at)
        .bind(&self.care_setting)
        .bind(&self.clinical_context)
        .bind(&self.patient_identifier)
        .bind(&self.age_band)
        .bind(&self.sex)
        .bind(self.sodium_mmol_l)
        .bind(self.potassium_mmol_l)
        .bind(self.chloride_mmol_l)
        .bind(self.bicarbonate_mmol_l)
        .bind(self.albumin_g_l)
        .bind(&self.include_potassium)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE anion_gap_calculators SET deleted_at = $2, patient_id = $3, clinician_id = \
            $4, clinician_name = $5, clinician_role = $6, calculated_at = $7, care_setting = \
            $8, clinical_context = $9, patient_identifier = $10, age_band = $11, sex = $12, \
            sodium_mmol_l = $13, potassium_mmol_l = $14, chloride_mmol_l = $15, \
            bicarbonate_mmol_l = $16, albumin_g_l = $17, include_potassium = $18, updated_at \
            = now() WHERE id = $1 RETURNING *",
        )
        .bind(id)
        .bind(self.deleted_at)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.clinician_name)
        .bind(&self.clinician_role)
        .bind(self.calculated_at)
        .bind(&self.care_setting)
        .bind(&self.clinical_context)
        .bind(&self.patient_identifier)
        .bind(&self.age_band)
        .bind(&self.sex)
        .bind(self.sodium_mmol_l)
        .bind(self.potassium_mmol_l)
        .bind(self.chloride_mmol_l)
        .bind(self.bicarbonate_mmol_l)
        .bind(self.albumin_g_l)
        .bind(&self.include_potassium)
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
        .prefix("api/anion_gap_calculators/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
