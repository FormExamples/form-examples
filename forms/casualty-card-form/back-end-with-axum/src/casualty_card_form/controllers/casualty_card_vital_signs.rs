#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::casualty_card_vital_signs::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub casualty_card_id: Uuid,
    pub heart_rate: Option<i32>,
    pub systolic_bp: Option<i32>,
    pub diastolic_bp: Option<i32>,
    pub respiratory_rate: Option<i32>,
    pub oxygen_saturation: Option<i32>,
    pub supplemental_oxygen: String,
    pub oxygen_flow_rate: String,
    pub temperature: Option<f64>,
    pub blood_glucose: Option<f64>,
    pub consciousness_level: String,
    pub pupil_left_size: Option<i32>,
    pub pupil_left_reactive: String,
    pub pupil_right_size: Option<i32>,
    pub pupil_right_reactive: String,
    pub capillary_refill_time: String,
    pub weight: Option<f64>,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO casualty_card_vital_signs (casualty_card_id, heart_rate, \
            systolic_bp, diastolic_bp, respiratory_rate, oxygen_saturation, \
            supplemental_oxygen, oxygen_flow_rate, temperature, blood_glucose, \
            consciousness_level, pupil_left_size, pupil_left_reactive, pupil_right_size, \
            pupil_right_reactive, capillary_refill_time, weight) VALUES ($1, $2, $3, $4, \
            $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING *",
        )
        .bind(self.casualty_card_id)
        .bind(self.heart_rate)
        .bind(self.systolic_bp)
        .bind(self.diastolic_bp)
        .bind(self.respiratory_rate)
        .bind(self.oxygen_saturation)
        .bind(&self.supplemental_oxygen)
        .bind(&self.oxygen_flow_rate)
        .bind(self.temperature)
        .bind(self.blood_glucose)
        .bind(&self.consciousness_level)
        .bind(self.pupil_left_size)
        .bind(&self.pupil_left_reactive)
        .bind(self.pupil_right_size)
        .bind(&self.pupil_right_reactive)
        .bind(&self.capillary_refill_time)
        .bind(self.weight)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE casualty_card_vital_signs SET casualty_card_id = $2, heart_rate = $3, \
            systolic_bp = $4, diastolic_bp = $5, respiratory_rate = $6, \
            oxygen_saturation = $7, supplemental_oxygen = $8, oxygen_flow_rate = $9, \
            temperature = $10, blood_glucose = $11, consciousness_level = $12, \
            pupil_left_size = $13, pupil_left_reactive = $14, pupil_right_size = $15, \
            pupil_right_reactive = $16, capillary_refill_time = $17, weight = $18, \
            updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.casualty_card_id)
        .bind(self.heart_rate)
        .bind(self.systolic_bp)
        .bind(self.diastolic_bp)
        .bind(self.respiratory_rate)
        .bind(self.oxygen_saturation)
        .bind(&self.supplemental_oxygen)
        .bind(&self.oxygen_flow_rate)
        .bind(self.temperature)
        .bind(self.blood_glucose)
        .bind(&self.consciousness_level)
        .bind(self.pupil_left_size)
        .bind(&self.pupil_left_reactive)
        .bind(self.pupil_right_size)
        .bind(&self.pupil_right_reactive)
        .bind(&self.capillary_refill_time)
        .bind(self.weight)
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
        .prefix("api/casualty_card_vital_signs/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
