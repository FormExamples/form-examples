#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::ottawa_ankle_rules_grades::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub unable_to_bear_weight: String,
    pub ankle_xray_indicated: String,
    pub foot_xray_indicated: String,
    pub recommended_action: String,
    pub graded_at: DateTimeWithTimeZone,
    pub ottawa_ankle_rules_id: Uuid,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO ottawa_ankle_rules_grades (unable_to_bear_weight, \
            ankle_xray_indicated, foot_xray_indicated, recommended_action, graded_at, \
            ottawa_ankle_rules_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
        )
        .bind(&self.unable_to_bear_weight)
        .bind(&self.ankle_xray_indicated)
        .bind(&self.foot_xray_indicated)
        .bind(&self.recommended_action)
        .bind(self.graded_at)
        .bind(self.ottawa_ankle_rules_id)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE ottawa_ankle_rules_grades SET unable_to_bear_weight = $2, \
            ankle_xray_indicated = $3, foot_xray_indicated = $4, recommended_action = \
            $5, graded_at = $6, ottawa_ankle_rules_id = $7, updated_at = now() WHERE id \
            = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(&self.unable_to_bear_weight)
        .bind(&self.ankle_xray_indicated)
        .bind(&self.foot_xray_indicated)
        .bind(&self.recommended_action)
        .bind(self.graded_at)
        .bind(self.ottawa_ankle_rules_id)
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
        .prefix("api/ottawa_ankle_rules_grades/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
