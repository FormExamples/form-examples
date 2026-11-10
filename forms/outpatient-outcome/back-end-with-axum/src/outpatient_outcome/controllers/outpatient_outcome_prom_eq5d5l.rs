#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::outpatient_outcome_prom_eq5d5ls::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub outpatient_outcome_id: Uuid,
    #[serde(default)]
    pub before_mobility: Option<i32>,
    #[serde(default)]
    pub before_self_care: Option<i32>,
    #[serde(default)]
    pub before_usual_activities: Option<i32>,
    #[serde(default)]
    pub before_pain_discomfort: Option<i32>,
    #[serde(default)]
    pub before_anxiety_depression: Option<i32>,
    #[serde(default)]
    pub before_vas: Option<i32>,
    #[serde(default)]
    pub after_mobility: Option<i32>,
    #[serde(default)]
    pub after_self_care: Option<i32>,
    #[serde(default)]
    pub after_usual_activities: Option<i32>,
    #[serde(default)]
    pub after_pain_discomfort: Option<i32>,
    #[serde(default)]
    pub after_anxiety_depression: Option<i32>,
    #[serde(default)]
    pub after_vas: Option<i32>,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO outpatient_outcome_prom_eq5d5ls (outpatient_outcome_id, \
            before_mobility, before_self_care, before_usual_activities, \
            before_pain_discomfort, before_anxiety_depression, before_vas, \
            after_mobility, after_self_care, after_usual_activities, \
            after_pain_discomfort, after_anxiety_depression, after_vas) VALUES ($1, $2, \
            $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *",
        )
        .bind(self.outpatient_outcome_id)
        .bind(self.before_mobility)
        .bind(self.before_self_care)
        .bind(self.before_usual_activities)
        .bind(self.before_pain_discomfort)
        .bind(self.before_anxiety_depression)
        .bind(self.before_vas)
        .bind(self.after_mobility)
        .bind(self.after_self_care)
        .bind(self.after_usual_activities)
        .bind(self.after_pain_discomfort)
        .bind(self.after_anxiety_depression)
        .bind(self.after_vas)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE outpatient_outcome_prom_eq5d5ls SET outpatient_outcome_id = $2, \
            before_mobility = $3, before_self_care = $4, before_usual_activities = $5, \
            before_pain_discomfort = $6, before_anxiety_depression = $7, before_vas = \
            $8, after_mobility = $9, after_self_care = $10, after_usual_activities = \
            $11, after_pain_discomfort = $12, after_anxiety_depression = $13, after_vas \
            = $14, updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.outpatient_outcome_id)
        .bind(self.before_mobility)
        .bind(self.before_self_care)
        .bind(self.before_usual_activities)
        .bind(self.before_pain_discomfort)
        .bind(self.before_anxiety_depression)
        .bind(self.before_vas)
        .bind(self.after_mobility)
        .bind(self.after_self_care)
        .bind(self.after_usual_activities)
        .bind(self.after_pain_discomfort)
        .bind(self.after_anxiety_depression)
        .bind(self.after_vas)
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
        .prefix("api/outpatient_outcome_prom_eq5d5ls/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
