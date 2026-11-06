#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::casualty_card_presenting_complaints::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub deleted_at: Option<DateTimeWithTimeZone>,
    pub casualty_card_id: Uuid,
    pub chief_complaint: String,
    pub history_of_presenting_complaint: String,
    pub onset: String,
    pub duration: String,
    pub character: String,
    pub severity: String,
    pub location: String,
    pub radiation: String,
    pub aggravating_factors: String,
    pub relieving_factors: String,
    pub associated_symptoms: String,
    pub previous_episodes: String,
    pub treatment_prior_to_arrival: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO casualty_card_presenting_complaints (deleted_at, casualty_card_id, \
            chief_complaint, history_of_presenting_complaint, onset, duration, character, \
            severity, location, radiation, aggravating_factors, relieving_factors, \
            associated_symptoms, previous_episodes, treatment_prior_to_arrival) VALUES ($1, \
            $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *",
        )
        .bind(self.deleted_at)
        .bind(self.casualty_card_id)
        .bind(&self.chief_complaint)
        .bind(&self.history_of_presenting_complaint)
        .bind(&self.onset)
        .bind(&self.duration)
        .bind(&self.character)
        .bind(&self.severity)
        .bind(&self.location)
        .bind(&self.radiation)
        .bind(&self.aggravating_factors)
        .bind(&self.relieving_factors)
        .bind(&self.associated_symptoms)
        .bind(&self.previous_episodes)
        .bind(&self.treatment_prior_to_arrival)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE casualty_card_presenting_complaints SET deleted_at = $2, casualty_card_id \
            = $3, chief_complaint = $4, history_of_presenting_complaint = $5, onset = $6, \
            duration = $7, character = $8, severity = $9, location = $10, radiation = $11, \
            aggravating_factors = $12, relieving_factors = $13, associated_symptoms = $14, \
            previous_episodes = $15, treatment_prior_to_arrival = $16, updated_at = now() \
            WHERE id = $1 RETURNING *",
        )
        .bind(id)
        .bind(self.deleted_at)
        .bind(self.casualty_card_id)
        .bind(&self.chief_complaint)
        .bind(&self.history_of_presenting_complaint)
        .bind(&self.onset)
        .bind(&self.duration)
        .bind(&self.character)
        .bind(&self.severity)
        .bind(&self.location)
        .bind(&self.radiation)
        .bind(&self.aggravating_factors)
        .bind(&self.relieving_factors)
        .bind(&self.associated_symptoms)
        .bind(&self.previous_episodes)
        .bind(&self.treatment_prior_to_arrival)
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
        .prefix("api/casualty_card_presenting_complaints/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
