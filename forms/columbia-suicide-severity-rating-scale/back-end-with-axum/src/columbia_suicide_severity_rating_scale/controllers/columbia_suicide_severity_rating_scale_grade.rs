#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::columbia_suicide_severity_rating_scale_grades::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub columbia_suicide_severity_rating_scale_id: Uuid,
    pub ideation_level: Option<i32>,
    pub any_behaviour: String,
    pub recent_behaviour: String,
    pub risk_tier: String,
    pub positive_features: String,
    pub management_recommendation: String,
    pub graded_at: DateTimeWithTimeZone,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO columbia_suicide_severity_rating_scale_grades \
            (columbia_suicide_severity_rating_scale_id, ideation_level, any_behaviour, \
            recent_behaviour, risk_tier, positive_features, management_recommendation, \
            graded_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
        )
        .bind(self.columbia_suicide_severity_rating_scale_id)
        .bind(self.ideation_level)
        .bind(&self.any_behaviour)
        .bind(&self.recent_behaviour)
        .bind(&self.risk_tier)
        .bind(&self.positive_features)
        .bind(&self.management_recommendation)
        .bind(self.graded_at)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE columbia_suicide_severity_rating_scale_grades SET \
            columbia_suicide_severity_rating_scale_id = $2, ideation_level = $3, \
            any_behaviour = $4, recent_behaviour = $5, risk_tier = $6, positive_features \
            = $7, management_recommendation = $8, graded_at = $9, updated_at = now() \
            WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.columbia_suicide_severity_rating_scale_id)
        .bind(self.ideation_level)
        .bind(&self.any_behaviour)
        .bind(&self.recent_behaviour)
        .bind(&self.risk_tier)
        .bind(&self.positive_features)
        .bind(&self.management_recommendation)
        .bind(self.graded_at)
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
        .prefix("api/columbia_suicide_severity_rating_scale_grades/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
