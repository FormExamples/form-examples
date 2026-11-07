#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::restrictions_limitations::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub release_form_id: Uuid,
    pub exclude_hiv: String,
    pub exclude_substance_abuse: String,
    pub exclude_mental_health: String,
    pub exclude_genetic_info: String,
    pub exclude_sti: String,
    pub additional_restrictions: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO restrictions_limitations (release_form_id, exclude_hiv, \
            exclude_substance_abuse, exclude_mental_health, exclude_genetic_info, \
            exclude_sti, additional_restrictions) VALUES ($1, $2, $3, $4, $5, $6, $7) \
            RETURNING *",
        )
        .bind(self.release_form_id)
        .bind(&self.exclude_hiv)
        .bind(&self.exclude_substance_abuse)
        .bind(&self.exclude_mental_health)
        .bind(&self.exclude_genetic_info)
        .bind(&self.exclude_sti)
        .bind(&self.additional_restrictions)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE restrictions_limitations SET release_form_id = $2, exclude_hiv = $3, \
            exclude_substance_abuse = $4, exclude_mental_health = $5, \
            exclude_genetic_info = $6, exclude_sti = $7, additional_restrictions = $8, \
            updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.release_form_id)
        .bind(&self.exclude_hiv)
        .bind(&self.exclude_substance_abuse)
        .bind(&self.exclude_mental_health)
        .bind(&self.exclude_genetic_info)
        .bind(&self.exclude_sti)
        .bind(&self.additional_restrictions)
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
        .prefix("api/restrictions_limitations/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
