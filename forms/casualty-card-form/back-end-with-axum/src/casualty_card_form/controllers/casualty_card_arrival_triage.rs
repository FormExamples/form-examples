#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::casualty_card_arrival_triages::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub casualty_card_id: Uuid,
    pub attendance_category: String,
    pub arrival_mode: String,
    pub referral_source: String,
    pub ambulance_incident_number: String,
    pub triage_time: Option<DateTimeWithTimeZone>,
    pub triage_nurse: String,
    pub mts_flowchart: String,
    pub mts_category: String,
    pub mts_discriminator: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO casualty_card_arrival_triages (casualty_card_id, \
            attendance_category, arrival_mode, referral_source, \
            ambulance_incident_number, triage_time, triage_nurse, mts_flowchart, \
            mts_category, mts_discriminator) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, \
            $10) RETURNING *",
        )
        .bind(self.casualty_card_id)
        .bind(&self.attendance_category)
        .bind(&self.arrival_mode)
        .bind(&self.referral_source)
        .bind(&self.ambulance_incident_number)
        .bind(self.triage_time)
        .bind(&self.triage_nurse)
        .bind(&self.mts_flowchart)
        .bind(&self.mts_category)
        .bind(&self.mts_discriminator)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE casualty_card_arrival_triages SET casualty_card_id = $2, \
            attendance_category = $3, arrival_mode = $4, referral_source = $5, \
            ambulance_incident_number = $6, triage_time = $7, triage_nurse = $8, \
            mts_flowchart = $9, mts_category = $10, mts_discriminator = $11, updated_at \
            = now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.casualty_card_id)
        .bind(&self.attendance_category)
        .bind(&self.arrival_mode)
        .bind(&self.referral_source)
        .bind(&self.ambulance_incident_number)
        .bind(self.triage_time)
        .bind(&self.triage_nurse)
        .bind(&self.mts_flowchart)
        .bind(&self.mts_category)
        .bind(&self.mts_discriminator)
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
        .prefix("api/casualty_card_arrival_triages/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
