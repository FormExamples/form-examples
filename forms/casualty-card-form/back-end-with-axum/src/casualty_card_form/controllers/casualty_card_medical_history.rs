#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::casualty_card_medical_histories::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub casualty_card_id: Uuid,
    pub past_medical_history: String,
    pub past_surgical_history: String,
    pub tetanus_status: String,
    pub smoking_status: String,
    pub alcohol_consumption: String,
    pub recreational_drug_use: String,
    pub last_oral_intake: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO casualty_card_medical_histories (casualty_card_id, \
            past_medical_history, past_surgical_history, tetanus_status, smoking_status, \
            alcohol_consumption, recreational_drug_use, last_oral_intake) VALUES ($1, \
            $2, $3, $4, $5, $6, $7, $8) RETURNING *",
        )
        .bind(self.casualty_card_id)
        .bind(&self.past_medical_history)
        .bind(&self.past_surgical_history)
        .bind(&self.tetanus_status)
        .bind(&self.smoking_status)
        .bind(&self.alcohol_consumption)
        .bind(&self.recreational_drug_use)
        .bind(&self.last_oral_intake)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE casualty_card_medical_histories SET casualty_card_id = $2, \
            past_medical_history = $3, past_surgical_history = $4, tetanus_status = $5, \
            smoking_status = $6, alcohol_consumption = $7, recreational_drug_use = $8, \
            last_oral_intake = $9, updated_at = now() WHERE id = $1 AND deleted_at IS \
            NULL RETURNING *",
        )
        .bind(id)
        .bind(self.casualty_card_id)
        .bind(&self.past_medical_history)
        .bind(&self.past_surgical_history)
        .bind(&self.tetanus_status)
        .bind(&self.smoking_status)
        .bind(&self.alcohol_consumption)
        .bind(&self.recreational_drug_use)
        .bind(&self.last_oral_intake)
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
        .prefix("api/casualty_card_medical_histories/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
