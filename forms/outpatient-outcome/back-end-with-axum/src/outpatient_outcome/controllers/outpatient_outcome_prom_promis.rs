#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::outpatient_outcome_prom_promis::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub outpatient_outcome_id: Uuid,
    #[serde(default)]
    pub item1_general_health: Option<i32>,
    #[serde(default)]
    pub item2_quality_of_life: Option<i32>,
    #[serde(default)]
    pub item3_physical_health: Option<i32>,
    #[serde(default)]
    pub item4_mental_health: Option<i32>,
    #[serde(default)]
    pub item5_social_activities: Option<i32>,
    #[serde(default)]
    pub item6_carry_out_physical: Option<i32>,
    #[serde(default)]
    pub item7_emotional_problems: Option<i32>,
    #[serde(default)]
    pub item8_fatigue: Option<i32>,
    #[serde(default)]
    pub item9_pain: Option<i32>,
    #[serde(default)]
    pub item10_everyday_activities: Option<i32>,
    #[serde(default)]
    pub global_physical_health_t_score: Option<f64>,
    #[serde(default)]
    pub global_mental_health_t_score: Option<f64>,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO outpatient_outcome_prom_promis (outpatient_outcome_id, \
            item1_general_health, item2_quality_of_life, item3_physical_health, \
            item4_mental_health, item5_social_activities, item6_carry_out_physical, \
            item7_emotional_problems, item8_fatigue, item9_pain, \
            item10_everyday_activities, global_physical_health_t_score, \
            global_mental_health_t_score) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, \
            $10, $11, $12, $13) RETURNING *",
        )
        .bind(self.outpatient_outcome_id)
        .bind(self.item1_general_health)
        .bind(self.item2_quality_of_life)
        .bind(self.item3_physical_health)
        .bind(self.item4_mental_health)
        .bind(self.item5_social_activities)
        .bind(self.item6_carry_out_physical)
        .bind(self.item7_emotional_problems)
        .bind(self.item8_fatigue)
        .bind(self.item9_pain)
        .bind(self.item10_everyday_activities)
        .bind(self.global_physical_health_t_score)
        .bind(self.global_mental_health_t_score)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE outpatient_outcome_prom_promis SET outpatient_outcome_id = $2, \
            item1_general_health = $3, item2_quality_of_life = $4, item3_physical_health \
            = $5, item4_mental_health = $6, item5_social_activities = $7, \
            item6_carry_out_physical = $8, item7_emotional_problems = $9, item8_fatigue \
            = $10, item9_pain = $11, item10_everyday_activities = $12, \
            global_physical_health_t_score = $13, global_mental_health_t_score = $14, \
            updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.outpatient_outcome_id)
        .bind(self.item1_general_health)
        .bind(self.item2_quality_of_life)
        .bind(self.item3_physical_health)
        .bind(self.item4_mental_health)
        .bind(self.item5_social_activities)
        .bind(self.item6_carry_out_physical)
        .bind(self.item7_emotional_problems)
        .bind(self.item8_fatigue)
        .bind(self.item9_pain)
        .bind(self.item10_everyday_activities)
        .bind(self.global_physical_health_t_score)
        .bind(self.global_mental_health_t_score)
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
        .prefix("api/outpatient_outcome_prom_promis/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
