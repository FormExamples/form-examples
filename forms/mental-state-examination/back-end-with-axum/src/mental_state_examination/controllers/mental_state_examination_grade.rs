#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::mental_state_examination_grades::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub mental_state_examination_id: Uuid,
    pub status: String,
    pub risk_level: String,
    pub completeness_percent: Option<i32>,
    pub appearance_behaviour_documented: String,
    pub speech_documented: String,
    pub emotion_documented: String,
    pub perception_documented: String,
    pub thought_documented: String,
    pub insight_documented: String,
    pub cognition_documented: String,
    pub graded_at: DateTimeWithTimeZone,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO mental_state_examination_grades (mental_state_examination_id, status, \
            risk_level, completeness_percent, appearance_behaviour_documented, \
            speech_documented, emotion_documented, perception_documented, thought_documented, \
            insight_documented, cognition_documented, graded_at) VALUES ($1, $2, $3, $4, $5, \
            $6, $7, $8, $9, $10, $11, $12) RETURNING *",
        )
        .bind(self.mental_state_examination_id)
        .bind(&self.status)
        .bind(&self.risk_level)
        .bind(self.completeness_percent)
        .bind(&self.appearance_behaviour_documented)
        .bind(&self.speech_documented)
        .bind(&self.emotion_documented)
        .bind(&self.perception_documented)
        .bind(&self.thought_documented)
        .bind(&self.insight_documented)
        .bind(&self.cognition_documented)
        .bind(self.graded_at)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE mental_state_examination_grades SET mental_state_examination_id = $2, \
            status = $3, risk_level = $4, completeness_percent = $5, \
            appearance_behaviour_documented = $6, speech_documented = $7, \
            emotion_documented = $8, perception_documented = $9, thought_documented = \
            $10, insight_documented = $11, cognition_documented = $12, graded_at = $13, \
            updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.mental_state_examination_id)
        .bind(&self.status)
        .bind(&self.risk_level)
        .bind(self.completeness_percent)
        .bind(&self.appearance_behaviour_documented)
        .bind(&self.speech_documented)
        .bind(&self.emotion_documented)
        .bind(&self.perception_documented)
        .bind(&self.thought_documented)
        .bind(&self.insight_documented)
        .bind(&self.cognition_documented)
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
        .prefix("api/mental_state_examination_grades/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
