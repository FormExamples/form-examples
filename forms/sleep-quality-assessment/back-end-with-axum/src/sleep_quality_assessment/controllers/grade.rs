#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::grades::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub deleted_at: Option<DateTimeWithTimeZone>,
    pub assessment_id: Uuid,
    pub psqi_global_score: Option<i32>,
    pub psqi_component1_subjective_quality: Option<i32>,
    pub psqi_component2_sleep_latency: Option<i32>,
    pub psqi_component3_sleep_duration: Option<i32>,
    pub psqi_component4_sleep_efficiency: Option<i32>,
    pub psqi_component5_sleep_disturbances: Option<i32>,
    pub psqi_component6_sleep_medication: Option<i32>,
    pub psqi_component7_daytime_dysfunction: Option<i32>,
    pub sleep_quality_category: String,
    pub graded_at: DateTimeWithTimeZone,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO grades (deleted_at, assessment_id, psqi_global_score, \
            psqi_component1_subjective_quality, psqi_component2_sleep_latency, \
            psqi_component3_sleep_duration, psqi_component4_sleep_efficiency, \
            psqi_component5_sleep_disturbances, psqi_component6_sleep_medication, \
            psqi_component7_daytime_dysfunction, sleep_quality_category, graded_at) VALUES \
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *",
        )
        .bind(self.deleted_at)
        .bind(self.assessment_id)
        .bind(self.psqi_global_score)
        .bind(self.psqi_component1_subjective_quality)
        .bind(self.psqi_component2_sleep_latency)
        .bind(self.psqi_component3_sleep_duration)
        .bind(self.psqi_component4_sleep_efficiency)
        .bind(self.psqi_component5_sleep_disturbances)
        .bind(self.psqi_component6_sleep_medication)
        .bind(self.psqi_component7_daytime_dysfunction)
        .bind(&self.sleep_quality_category)
        .bind(self.graded_at)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE grades SET deleted_at = $2, assessment_id = $3, psqi_global_score = $4, \
            psqi_component1_subjective_quality = $5, psqi_component2_sleep_latency = $6, \
            psqi_component3_sleep_duration = $7, psqi_component4_sleep_efficiency = $8, \
            psqi_component5_sleep_disturbances = $9, psqi_component6_sleep_medication = $10, \
            psqi_component7_daytime_dysfunction = $11, sleep_quality_category = $12, \
            graded_at = $13, updated_at = now() WHERE id = $1 RETURNING *",
        )
        .bind(id)
        .bind(self.deleted_at)
        .bind(self.assessment_id)
        .bind(self.psqi_global_score)
        .bind(self.psqi_component1_subjective_quality)
        .bind(self.psqi_component2_sleep_latency)
        .bind(self.psqi_component3_sleep_duration)
        .bind(self.psqi_component4_sleep_efficiency)
        .bind(self.psqi_component5_sleep_disturbances)
        .bind(self.psqi_component6_sleep_medication)
        .bind(self.psqi_component7_daytime_dysfunction)
        .bind(&self.sleep_quality_category)
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
        .prefix("api/grades/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
