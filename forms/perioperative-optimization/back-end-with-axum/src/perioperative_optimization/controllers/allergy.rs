#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::allergies::Model;
use crate::support::validation::{TEXT_MAX, unprocessable};

#[derive(Clone, Debug, Serialize, Deserialize, Validate)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    #[validate(length(max = TEXT_MAX))]
    pub scientific_name: String,
    #[validate(length(max = TEXT_MAX))]
    pub european_union_name: String,
    #[validate(length(max = TEXT_MAX))]
    pub united_states_name: String,
    #[validate(length(max = TEXT_MAX))]
    pub cosmetic_name: String,
    #[validate(length(max = TEXT_MAX))]
    pub kind: String,
    pub is_regulated_food_allergen: bool,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO allergies (scientific_name, european_union_name, \
            united_states_name, cosmetic_name, kind, is_regulated_food_allergen) VALUES \
            ($1, $2, $3, $4, $5, $6) RETURNING *",
        )
        .bind(&self.scientific_name)
        .bind(&self.european_union_name)
        .bind(&self.united_states_name)
        .bind(&self.cosmetic_name)
        .bind(&self.kind)
        .bind(self.is_regulated_food_allergen)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE allergies SET scientific_name = $2, european_union_name = $3, \
            united_states_name = $4, cosmetic_name = $5, kind = $6, \
            is_regulated_food_allergen = $7, updated_at = now() WHERE id = $1 AND \
            deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(&self.scientific_name)
        .bind(&self.european_union_name)
        .bind(&self.united_states_name)
        .bind(&self.cosmetic_name)
        .bind(&self.kind)
        .bind(self.is_regulated_food_allergen)
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
    params.validate().map_err(|e| unprocessable(&e))?;
    let item = params.insert(&db(&ctx)).await?;
    format::json(item)
}

#[debug_handler]
pub async fn update(
    Path(id): Path<Uuid>,
    State(ctx): State<AppContext>,
    Json(params): Json<Params>,
) -> Result<Response> {
    params.validate().map_err(|e| unprocessable(&e))?;
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
        .prefix("api/perioperative-optimization/allergies/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
