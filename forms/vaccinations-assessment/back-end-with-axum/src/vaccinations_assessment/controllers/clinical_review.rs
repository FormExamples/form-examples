#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::clinical_reviews::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub deleted_at: Option<DateTimeWithTimeZone>,
    pub assessment_id: Uuid,
    pub post_vaccination_observation: Option<i32>,
    pub immediate_reaction: String,
    pub reaction_details: String,
    pub next_dose_due: Option<Date>,
    pub catch_up_schedule_needed: String,
    pub referral_needed: String,
    pub clinician_notes: String,
    pub reviewing_clinician: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO clinical_reviews (deleted_at, assessment_id, \
            post_vaccination_observation, immediate_reaction, reaction_details, \
            next_dose_due, catch_up_schedule_needed, referral_needed, clinician_notes, \
            reviewing_clinician) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *",
        )
        .bind(self.deleted_at)
        .bind(self.assessment_id)
        .bind(self.post_vaccination_observation)
        .bind(&self.immediate_reaction)
        .bind(&self.reaction_details)
        .bind(self.next_dose_due)
        .bind(&self.catch_up_schedule_needed)
        .bind(&self.referral_needed)
        .bind(&self.clinician_notes)
        .bind(&self.reviewing_clinician)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE clinical_reviews SET deleted_at = $2, assessment_id = $3, \
            post_vaccination_observation = $4, immediate_reaction = $5, reaction_details = \
            $6, next_dose_due = $7, catch_up_schedule_needed = $8, referral_needed = $9, \
            clinician_notes = $10, reviewing_clinician = $11, updated_at = now() WHERE id = \
            $1 RETURNING *",
        )
        .bind(id)
        .bind(self.deleted_at)
        .bind(self.assessment_id)
        .bind(self.post_vaccination_observation)
        .bind(&self.immediate_reaction)
        .bind(&self.reaction_details)
        .bind(self.next_dose_due)
        .bind(&self.catch_up_schedule_needed)
        .bind(&self.referral_needed)
        .bind(&self.clinician_notes)
        .bind(&self.reviewing_clinician)
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
        .prefix("api/clinical_reviews/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
