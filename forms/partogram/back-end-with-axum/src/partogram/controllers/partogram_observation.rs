#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::partogram_observations::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub partogram_id: Uuid,
    pub observed_at: Option<DateTimeWithTimeZone>,
    pub cervical_dilatation_cm: Option<f64>,
    pub descent_fifths: Option<f64>,
    pub contractions_per_10_min: Option<f64>,
    pub contraction_duration_band: String,
    pub contraction_strength: String,
    pub fetal_heart_rate: Option<i32>,
    pub liquor_state: String,
    pub moulding: String,
    pub systolic_blood_pressure: Option<i32>,
    pub diastolic_blood_pressure: Option<i32>,
    pub pulse: Option<i32>,
    pub temperature: Option<f64>,
    pub urine_volume_ml: Option<f64>,
    pub urine_protein: String,
    pub urine_ketones: String,
    pub urine_glucose: String,
    pub oxytocin_rate: Option<f64>,
    pub drugs_and_fluids: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO partogram_observations (partogram_id, observed_at, \
            cervical_dilatation_cm, descent_fifths, contractions_per_10_min, \
            contraction_duration_band, contraction_strength, fetal_heart_rate, liquor_state, \
            moulding, systolic_blood_pressure, diastolic_blood_pressure, pulse, temperature, \
            urine_volume_ml, urine_protein, urine_ketones, urine_glucose, oxytocin_rate, \
            drugs_and_fluids) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, \
            $14, $15, $16, $17, $18, $19, $20) RETURNING *",
        )
        .bind(self.partogram_id)
        .bind(self.observed_at)
        .bind(self.cervical_dilatation_cm)
        .bind(self.descent_fifths)
        .bind(self.contractions_per_10_min)
        .bind(&self.contraction_duration_band)
        .bind(&self.contraction_strength)
        .bind(self.fetal_heart_rate)
        .bind(&self.liquor_state)
        .bind(&self.moulding)
        .bind(self.systolic_blood_pressure)
        .bind(self.diastolic_blood_pressure)
        .bind(self.pulse)
        .bind(self.temperature)
        .bind(self.urine_volume_ml)
        .bind(&self.urine_protein)
        .bind(&self.urine_ketones)
        .bind(&self.urine_glucose)
        .bind(self.oxytocin_rate)
        .bind(&self.drugs_and_fluids)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE partogram_observations SET partogram_id = $2, observed_at = $3, \
            cervical_dilatation_cm = $4, descent_fifths = $5, contractions_per_10_min = \
            $6, contraction_duration_band = $7, contraction_strength = $8, \
            fetal_heart_rate = $9, liquor_state = $10, moulding = $11, \
            systolic_blood_pressure = $12, diastolic_blood_pressure = $13, pulse = $14, \
            temperature = $15, urine_volume_ml = $16, urine_protein = $17, urine_ketones \
            = $18, urine_glucose = $19, oxytocin_rate = $20, drugs_and_fluids = $21, \
            updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.partogram_id)
        .bind(self.observed_at)
        .bind(self.cervical_dilatation_cm)
        .bind(self.descent_fifths)
        .bind(self.contractions_per_10_min)
        .bind(&self.contraction_duration_band)
        .bind(&self.contraction_strength)
        .bind(self.fetal_heart_rate)
        .bind(&self.liquor_state)
        .bind(&self.moulding)
        .bind(self.systolic_blood_pressure)
        .bind(self.diastolic_blood_pressure)
        .bind(self.pulse)
        .bind(self.temperature)
        .bind(self.urine_volume_ml)
        .bind(&self.urine_protein)
        .bind(&self.urine_ketones)
        .bind(&self.urine_glucose)
        .bind(self.oxytocin_rate)
        .bind(&self.drugs_and_fluids)
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
        .prefix("api/partogram_observations/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
